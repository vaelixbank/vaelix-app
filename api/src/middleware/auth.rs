use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::{Response, IntoResponse},
    Extension,
};
use crate::config::app_config::AppConfig;
use crate::utils::jwt::{verify_token, Claims};

pub async fn auth_middleware(
    Extension(config): Extension<AppConfig>,
    mut req: Request<axum::body::Body>,
    next: axum::middleware::Next,
) -> Result<Response, StatusCode> {
    // Extract token from Authorization header
    let auth_header = req
        .headers()
        .get("authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "));

    let token = match auth_header {
        Some(token) => token,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    // Verify token
    match verify_token(token, &config.jwt_secret) {
        Ok(claims) => {
            // Add user info to request extensions
            req.extensions_mut().insert(claims);
            Ok(next.run(req).await)
        }
        Err(_) => Err(StatusCode::UNAUTHORIZED),
    }
}

pub async fn optional_auth_middleware(
    Extension(config): Extension<AppConfig>,
    mut req: Request<axum::body::Body>,
    next: axum::middleware::Next,
) -> Result<Response, StatusCode> {
    // Extract token from Authorization header (optional)
    let auth_header = req
        .headers()
        .get("authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "));

    if let Some(token) = auth_header {
        // Verify token if present
        if let Ok(claims) = verify_token(token, &config.jwt_secret) {
            req.extensions_mut().insert(claims);
        }
    }

    Ok(next.run(req).await)
}