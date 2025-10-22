use axum::{Json, http::StatusCode, extract::Path, Extension};
use uuid::Uuid;
use crate::services::beneficiary_service;
use crate::services::database::DbPool;
use crate::models::beneficiary::{CreateBeneficiaryRequest, BeneficiaryResponse};
use crate::utils::jwt::Claims;

#[axum::debug_handler]
pub async fn create_beneficiary(
    Extension(pool): Extension<DbPool>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateBeneficiaryRequest>,
) -> Result<Json<BeneficiaryResponse>, StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    match beneficiary_service::create_beneficiary(&pool, user_id, payload).await {
        Ok(beneficiary) => Ok(Json(beneficiary)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_beneficiaries(
    Extension(pool): Extension<DbPool>,
    Extension(claims): Extension<Claims>,
) -> Result<Json<Vec<BeneficiaryResponse>>, StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    match beneficiary_service::get_beneficiaries_by_user(&pool, user_id).await {
        Ok(beneficiaries) => Ok(Json(beneficiaries)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn get_beneficiary(
    Extension(pool): Extension<DbPool>,
    Extension(claims): Extension<Claims>,
    Path(beneficiary_id): Path<Uuid>,
) -> Result<Json<BeneficiaryResponse>, StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    match beneficiary_service::get_beneficiary(&pool, beneficiary_id, user_id).await {
        Ok(Some(beneficiary)) => Ok(Json(beneficiary)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[axum::debug_handler]
pub async fn delete_beneficiary(
    Extension(pool): Extension<DbPool>,
    Extension(claims): Extension<Claims>,
    Path(beneficiary_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    match beneficiary_service::delete_beneficiary(&pool, beneficiary_id, user_id).await {
        Ok(true) => Ok(StatusCode::NO_CONTENT),
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}