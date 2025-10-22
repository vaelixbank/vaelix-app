use axum::{Json, http::StatusCode, extract::{Path, Query}, Extension};
use uuid::Uuid;
use serde::Deserialize;
use crate::services::transaction_service;
use crate::services::database::DbPool;
use crate::models::transaction::{SendMoneyRequest, TransferRequest, TransactionResponse};

#[derive(Debug, Deserialize)]
pub struct TransactionQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[axum::debug_handler]
pub async fn send_money(
    Extension(pool): Extension<DbPool>,
    Json(payload): Json<SendMoneyRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    match transaction_service::send_money(&pool, payload).await {
        Ok(transaction) => Ok(Json(transaction)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn transfer_money(
    Extension(pool): Extension<DbPool>,
    Json(payload): Json<TransferRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    match transaction_service::transfer_money(&pool, payload).await {
        Ok(transaction) => Ok(Json(transaction)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_transactions(
    Extension(pool): Extension<DbPool>,
    Path(account_id): Path<Uuid>,
    Query(query): Query<TransactionQuery>,
) -> Result<Json<Vec<TransactionResponse>>, StatusCode> {
    match transaction_service::get_transactions_by_account(&pool, account_id, query.limit, query.offset).await {
        Ok(transactions) => Ok(Json(transactions)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_transaction(
    Extension(pool): Extension<DbPool>,
    Path(transaction_id): Path<Uuid>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    match transaction_service::get_transaction(&pool, transaction_id).await {
        Ok(Some(transaction)) => Ok(Json(transaction)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}