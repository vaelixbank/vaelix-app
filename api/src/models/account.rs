use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Account {
    pub id: Uuid,
    pub user_id: Uuid,
    pub profile_id: String,
    pub friendly_name: String,
    pub iban: Option<String>,
    pub account_number: Option<String>,
    pub sort_code: Option<String>,
    pub balance: rust_decimal::Decimal,
    pub currency: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}