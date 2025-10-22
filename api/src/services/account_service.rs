use crate::models::account::Account;
use crate::services::database::DbPool;
use sqlx::Row;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateAccountRequest {
    pub profile_id: String,
    pub friendly_name: String,
}

#[derive(Debug, Serialize)]
pub struct AccountResponse {
    pub id: Uuid,
    pub profile_id: String,
    pub friendly_name: String,
    pub iban: Option<String>,
}

pub async fn create_account(
    pool: &DbPool,
    user_id: Uuid,
    request: CreateAccountRequest,
) -> Result<AccountResponse, sqlx::Error> {
    let account_id = Uuid::new_v4();
    let iban = generate_mock_iban(); // TODO: Integrate with Weavr API

    sqlx::query(
        "INSERT INTO accounts (id, user_id, profile_id, friendly_name, iban) VALUES ($1, $2, $3, $4, $5)"
    )
    .bind(account_id)
    .bind(user_id)
    .bind(&request.profile_id)
    .bind(&request.friendly_name)
    .bind(&iban)
    .execute(pool)
    .await?;

    Ok(AccountResponse {
        id: account_id,
        profile_id: request.profile_id,
        friendly_name: request.friendly_name,
        iban: Some(iban),
    })
}

pub async fn get_account_iban(
    pool: &DbPool,
    account_id: Uuid,
) -> Result<Option<String>, sqlx::Error> {
    let row = sqlx::query("SELECT iban FROM accounts WHERE id = $1")
        .bind(account_id)
        .fetch_optional(pool)
        .await?;

    Ok(row.and_then(|r| r.try_get("iban").ok()))
}

fn generate_mock_iban() -> String {
    // Generate a mock IBAN for testing
    // In production, this would come from Weavr API
    format!("GB29 NWBK 6016 1331 9268 19")
}