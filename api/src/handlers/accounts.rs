use axum::{Json, http::StatusCode, extract::Path, Extension};
use serde::Serialize;
use uuid::Uuid;
use crate::services::account_service::{self, CreateAccountRequest, AccountResponse};
use crate::services::database::DbPool;

#[derive(Debug, Serialize)]
pub struct IbanResponse {
    pub iban: String,
}

#[axum::debug_handler]
pub async fn create_account(
    Extension(pool): Extension<DbPool>,
    Json(payload): Json<CreateAccountRequest>,
) -> Result<Json<AccountResponse>, StatusCode> {
    // TODO: Get user_id from authentication
    let user_id = Uuid::new_v4(); // Mock user_id for now

    match account_service::create_account(&pool, user_id, payload).await {
        Ok(account) => Ok(Json(account)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_iban(
    Extension(pool): Extension<DbPool>,
    Path(account_id): Path<Uuid>,
) -> Result<Json<IbanResponse>, StatusCode> {
    match account_service::get_account_iban(&pool, account_id).await {
        Ok(Some(iban)) => Ok(Json(IbanResponse { iban })),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}