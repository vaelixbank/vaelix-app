use axum::{
    routing::get,
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Build our application with a route
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive());

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 Server running on http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Vaelix Bank API"
}

async fn health_check() -> &'static str {
    "OK"
}
