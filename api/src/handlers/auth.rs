use axum::{Json, http::StatusCode, Extension};
use serde::{Deserialize, Serialize};
use crate::services::auth_service;
use crate::services::database::DbPool;
use crate::config::app_config::AppConfig;

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: UserResponse,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub name: String,
    pub user_type: String,
}

pub async fn login(
    Extension(pool): Extension<DbPool>,
    Extension(config): Extension<AppConfig>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    // Authenticate user
    let user = match auth_service::authenticate_user(&pool, &payload.email, &payload.password).await {
        Ok(Some(user)) => user,
        Ok(None) => return Err(StatusCode::UNAUTHORIZED),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Generate tokens
    let (token, refresh_token) = match auth_service::generate_tokens(&user, &config.jwt_secret, &config.jwt_refresh_secret) {
        Ok(tokens) => tokens,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let user_response = UserResponse {
        id: user.id.to_string(),
        email: user.email,
        name: user.name,
        user_type: format!("{:?}", user.user_type),
    };

    let response = LoginResponse {
        token,
        refresh_token,
        user: user_response,
    };

    Ok(Json(response))
}