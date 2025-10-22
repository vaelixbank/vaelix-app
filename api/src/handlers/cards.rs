use axum::{Json, http::StatusCode, extract::Path, Extension};
use uuid::Uuid;
use crate::services::card_service;
use crate::services::database::DbPool;
use crate::models::card::{CreateCardRequest, CardResponse, CardDetailsResponse};

#[axum::debug_handler]
pub async fn create_card(
    Extension(pool): Extension<DbPool>,
    Json(payload): Json<CreateCardRequest>,
) -> Result<Json<CardResponse>, StatusCode> {
    match card_service::create_card(&pool, payload).await {
        Ok(card) => Ok(Json(card)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_card(
    Extension(pool): Extension<DbPool>,
    Path(card_id): Path<Uuid>,
) -> Result<Json<CardResponse>, StatusCode> {
    match card_service::get_card(&pool, card_id).await {
        Ok(Some(card)) => {
            // Convert Card to CardResponse
            let card_number = card.card_number_encrypted.unwrap_or_else(|| "4111111111111111".to_string());
            let response = CardResponse {
                id: card.id,
                account_id: card.account_id,
                card_type: card.card_type,
                friendly_name: card.friendly_name,
                masked_card_number: card_service::mask_card_number(&card_number),
                expiry_month: card.expiry_month,
                expiry_year: card.expiry_year,
                status: card.status,
                created_at: card.created_at,
            };
            Ok(Json(response))
        }
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_card_details(
    Extension(pool): Extension<DbPool>,
    Path(card_id): Path<Uuid>,
) -> Result<Json<CardDetailsResponse>, StatusCode> {
    match card_service::get_card_details(&pool, card_id).await {
        Ok(Some(card_details)) => Ok(Json(card_details)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_cards_by_account(
    Extension(pool): Extension<DbPool>,
    Path(account_id): Path<Uuid>,
) -> Result<Json<Vec<CardResponse>>, StatusCode> {
    match card_service::get_cards_by_account(&pool, account_id).await {
        Ok(cards) => Ok(Json(cards)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}