use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::{Response, IntoResponse},
    Extension,
};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::{Duration, Instant};

#[derive(Clone)]
pub struct RateLimiter {
    requests: Arc<Mutex<HashMap<String, Vec<Instant>>>>,
    max_requests: u32,
    window: Duration,
}

impl RateLimiter {
    pub fn new(max_requests: u32, window_seconds: u64) -> Self {
        Self {
            requests: Arc::new(Mutex::new(HashMap::new())),
            max_requests,
            window: Duration::from_secs(window_seconds),
        }
    }

    pub async fn check_rate_limit(&self, key: &str) -> bool {
        let mut requests = self.requests.lock().await;
        let now = Instant::now();

        let user_requests = requests.entry(key.to_string()).or_insert_with(Vec::new);

        // Remove old requests outside the window
        user_requests.retain(|&time| now.duration_since(time) < self.window);

        // Check if under limit
        if user_requests.len() < self.max_requests as usize {
            user_requests.push(now);
            true
        } else {
            false
        }
    }
}

pub async fn rate_limit_middleware(
    Extension(rate_limiter): Extension<RateLimiter>,
    req: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    // Use IP address as rate limit key (in production, use user ID)
    let key = req
        .headers()
        .get("x-forwarded-for")
        .and_then(|h| h.to_str().ok())
        .or_else(|| req.headers().get("x-real-ip").and_then(|h| h.to_str().ok()))
        .unwrap_or("unknown");

    if rate_limiter.check_rate_limit(key).await {
        Ok(next.run(req).await)
    } else {
        Err(StatusCode::TOO_MANY_REQUESTS)
    }
}