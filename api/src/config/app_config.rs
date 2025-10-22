use serde::Deserialize;
use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_refresh_secret: String,
    pub encryption_key: String,
    pub port: u16,
    pub env: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self, anyhow::Error> {
        dotenvy::dotenv().ok();

        Ok(Self {
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://vaelixbank_user:password@localhost/vaelixbank".to_string()),
            jwt_secret: env::var("JWT_SECRET").unwrap_or_else(|_| "your-super-secret-jwt-key-here-at-least-32-characters-long".to_string()),
            jwt_refresh_secret: env::var("JWT_REFRESH_SECRET").unwrap_or_else(|_| "your-refresh-secret-key-here-at-least-32-characters-long".to_string()),
            encryption_key: env::var("ENCRYPTION_KEY").unwrap_or_else(|_| "your-64-character-hex-encryption-key-here".to_string()),
            port: env::var("PORT").unwrap_or_else(|_| "8080".to_string()).parse().unwrap_or(8080),
            env: env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string()),
        })
    }
}