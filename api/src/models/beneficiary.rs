use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Beneficiary {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub iban: String,
    pub account_number: Option<String>,
    pub sort_code: Option<String>,
    pub bank_name: Option<String>,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBeneficiaryRequest {
    pub name: String,
    pub iban: String,
    pub account_number: Option<String>,
    pub sort_code: Option<String>,
    pub bank_name: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct BeneficiaryResponse {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub iban: String,
    pub account_number: Option<String>,
    pub sort_code: Option<String>,
    pub bank_name: Option<String>,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
}