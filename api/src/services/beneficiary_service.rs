use crate::models::beneficiary::{Beneficiary, CreateBeneficiaryRequest, BeneficiaryResponse};
use crate::services::database::DbPool;
use sqlx::Row;
use uuid::Uuid;

pub async fn create_beneficiary(
    pool: &DbPool,
    user_id: Uuid,
    request: CreateBeneficiaryRequest,
) -> Result<BeneficiaryResponse, sqlx::Error> {
    let beneficiary_id = Uuid::new_v4();

    sqlx::query(
        "INSERT INTO beneficiaries (id, user_id, name, iban, account_number, sort_code, bank_name, verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    )
    .bind(beneficiary_id)
    .bind(user_id)
    .bind(&request.name)
    .bind(&request.iban)
    .bind(&request.account_number)
    .bind(&request.sort_code)
    .bind(&request.bank_name)
    .bind(false) // Not verified by default
    .execute(pool)
    .await?;

    Ok(BeneficiaryResponse {
        id: beneficiary_id,
        user_id,
        name: request.name,
        iban: request.iban,
        account_number: request.account_number,
        sort_code: request.sort_code,
        bank_name: request.bank_name,
        verified: false,
        created_at: chrono::Utc::now(),
    })
}

pub async fn get_beneficiaries_by_user(
    pool: &DbPool,
    user_id: Uuid,
) -> Result<Vec<BeneficiaryResponse>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, user_id, name, iban, account_number, sort_code, bank_name, verified, created_at FROM beneficiaries WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    let mut beneficiaries = Vec::new();
    for row in rows {
        beneficiaries.push(BeneficiaryResponse {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            name: row.try_get("name")?,
            iban: row.try_get("iban")?,
            account_number: row.try_get("account_number")?,
            sort_code: row.try_get("sort_code")?,
            bank_name: row.try_get("bank_name")?,
            verified: row.try_get("verified")?,
            created_at: row.try_get("created_at")?,
        });
    }

    Ok(beneficiaries)
}

pub async fn get_beneficiary(
    pool: &DbPool,
    beneficiary_id: Uuid,
    user_id: Uuid,
) -> Result<Option<BeneficiaryResponse>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, user_id, name, iban, account_number, sort_code, bank_name, verified, created_at FROM beneficiaries WHERE id = $1 AND user_id = $2"
    )
    .bind(beneficiary_id)
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        Ok(Some(BeneficiaryResponse {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            name: row.try_get("name")?,
            iban: row.try_get("iban")?,
            account_number: row.try_get("account_number")?,
            sort_code: row.try_get("sort_code")?,
            bank_name: row.try_get("bank_name")?,
            verified: row.try_get("verified")?,
            created_at: row.try_get("created_at")?,
        }))
    } else {
        Ok(None)
    }
}

pub async fn delete_beneficiary(
    pool: &DbPool,
    beneficiary_id: Uuid,
    user_id: Uuid,
) -> Result<bool, sqlx::Error> {
    let result = sqlx::query(
        "DELETE FROM beneficiaries WHERE id = $1 AND user_id = $2"
    )
    .bind(beneficiary_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(result.rows_affected() > 0)
}