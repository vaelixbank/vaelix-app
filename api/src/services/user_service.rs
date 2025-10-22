use crate::models::user::{User, CreateUserRequest, UserResponse, UserType};
use crate::services::database::DbPool;
use crate::services::auth_service;
use sqlx::Row;
use uuid::Uuid;

pub async fn create_user(
    pool: &DbPool,
    request: CreateUserRequest,
) -> Result<UserResponse, sqlx::Error> {
    // Hash password (for now, use a default password since it's not in the request)
    let hashed_password = auth_service::hash_password("defaultpassword123")
        .await
        .map_err(|_| sqlx::Error::RowNotFound)?; // TODO: Handle this better

    let user_id = Uuid::new_v4();

    sqlx::query(
        "INSERT INTO users (id, email, name, user_type, hashed_password) VALUES ($1, $2, $3, $4, $5)"
    )
    .bind(user_id)
    .bind(&request.email)
    .bind(&request.name)
    .bind(format!("{:?}", request.user_type).to_lowercase())
    .bind(&hashed_password)
    .execute(pool)
    .await?;

    Ok(UserResponse {
        id: user_id,
        email: request.email,
        name: request.name,
        user_type: request.user_type,
        created_at: chrono::Utc::now(),
    })
}

pub async fn get_user_by_id(
    pool: &DbPool,
    user_id: Uuid,
) -> Result<Option<User>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, email, name, user_type, created_at, updated_at FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        let user = User {
            id: row.try_get("id")?,
            email: row.try_get("email")?,
            name: row.try_get("name")?,
            user_type: row.try_get("user_type")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
        };
        Ok(Some(user))
    } else {
        Ok(None)
    }
}