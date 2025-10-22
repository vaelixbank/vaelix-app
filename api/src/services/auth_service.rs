use bcrypt::{hash, verify, DEFAULT_COST};
use crate::utils::jwt;
use crate::models::user::User;
use crate::services::database::DbPool;
use sqlx::Row;

pub async fn hash_password(password: &str) -> Result<String, bcrypt::BcryptError> {
    hash(password, DEFAULT_COST)
}

pub async fn verify_password(password: &str, hash: &str) -> Result<bool, bcrypt::BcryptError> {
    verify(password, hash)
}

pub async fn authenticate_user(
    pool: &DbPool,
    email: &str,
    password: &str,
) -> Result<Option<User>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, email, name, user_type, hashed_password, created_at, updated_at FROM users WHERE email = $1"
    )
    .bind(email)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        let hashed_password: String = row.try_get("hashed_password")?;
        if verify_password(password, &hashed_password).await.unwrap_or(false) {
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
    } else {
        Ok(None)
    }
}

pub fn generate_tokens(user: &User, jwt_secret: &str, refresh_secret: &str) -> Result<(String, String), jsonwebtoken::errors::Error> {
    let access_token = jwt::create_access_token(&user.id.to_string(), &user.email, jwt_secret)?;
    let refresh_token = jwt::create_refresh_token(&user.id.to_string(), &user.email, refresh_secret)?;

    Ok((access_token, refresh_token))
}