mod handlers;
mod models;
mod services;
mod middleware;
mod utils;
mod config;

use axum::{
    routing::{get, post},
    Router,
    Extension,
    middleware::from_fn,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Load configuration
    let config = config::app_config::AppConfig::from_env()
        .expect("Failed to load configuration");

    // Initialize database (optional for development)
    let pool = match services::database::create_pool(&config).await {
        Ok(pool) => {
            // Run migrations
            if let Err(e) = services::database::run_migrations(&pool).await {
                eprintln!("Warning: Failed to run migrations: {}", e);
            }
            pool
        }
        Err(e) => {
            eprintln!("Warning: Failed to connect to database: {}. Using mock database.", e);
            // For now, we'll panic on database operations
            panic!("Database connection required for this demo");
        }
    };

    // Initialize rate limiter (100 requests per minute per IP)
    let rate_limiter = middleware::rate_limit::RateLimiter::new(100, 60);

    // Build our application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/auth/login", axum::routing::post(handlers::auth::login))
        .route("/api/consumers", axum::routing::post(handlers::users::create_consumer))
        .route("/api/corporates", axum::routing::post(handlers::users::create_corporate))
        .route("/api/accounts", axum::routing::post(handlers::accounts::create_account).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/accounts/:id/iban", axum::routing::get(handlers::accounts::get_iban).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/cards", axum::routing::post(handlers::cards::create_card).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/cards/:id", axum::routing::get(handlers::cards::get_card).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/cards/:id/details", axum::routing::get(handlers::cards::get_card_details).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/accounts/:account_id/cards", axum::routing::get(handlers::cards::get_cards_by_account).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/transactions/sends", axum::routing::post(handlers::transactions::send_money).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/transactions/transfers", axum::routing::post(handlers::transactions::transfer_money).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/accounts/:account_id/transactions", axum::routing::get(handlers::transactions::get_transactions).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/transactions/:id", axum::routing::get(handlers::transactions::get_transaction).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/beneficiaries", axum::routing::post(handlers::beneficiaries::create_beneficiary).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/beneficiaries", axum::routing::get(handlers::beneficiaries::get_beneficiaries).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/beneficiaries/:id", axum::routing::get(handlers::beneficiaries::get_beneficiary).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/beneficiaries/:id", axum::routing::delete(handlers::beneficiaries::delete_beneficiary).layer(from_fn(middleware::auth::auth_middleware)))
        .route("/api/dashboard", axum::routing::get(handlers::dashboard::get_dashboard).layer(from_fn(middleware::auth::auth_middleware)))
        .layer(Extension(pool))
        .layer(Extension(config))
        .layer(Extension(rate_limiter))
        .layer(from_fn(middleware::rate_limit::rate_limit_middleware))
        .layer(CorsLayer::permissive());

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Vaelix Bank API"
}

async fn health_check() -> &'static str {
    "OK"
}
