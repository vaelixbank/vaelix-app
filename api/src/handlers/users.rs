use axum::{Json, http::StatusCode, Extension};
use crate::models::user::{CreateUserRequest, UserResponse, UserType};
use crate::services::user_service;
use crate::services::database::DbPool;

pub async fn create_consumer(
    Extension(pool): Extension<DbPool>,
    Json(mut payload): Json<CreateUserRequest>,
) -> Result<Json<UserResponse>, StatusCode> {
    payload.user_type = UserType::Consumer;

    match user_service::create_user(&pool, payload).await {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn create_corporate(
    Extension(pool): Extension<DbPool>,
    Json(mut payload): Json<CreateUserRequest>,
) -> Result<Json<UserResponse>, StatusCode> {
    payload.user_type = UserType::Corporate;

    match user_service::create_user(&pool, payload).await {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}