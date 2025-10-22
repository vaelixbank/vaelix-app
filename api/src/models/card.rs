use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Card {
    pub id: Uuid,
    pub account_id: Uuid,
    pub card_type: CardType,
    pub friendly_name: String,
    pub card_number_encrypted: Option<String>,
    pub expiry_month: i32,
    pub expiry_year: i32,
    pub cvv_encrypted: Option<String>,
    pub status: CardStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "card_type", rename_all = "lowercase")]
pub enum CardType {
    Virtual,
    Physical,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "card_status", rename_all = "lowercase")]
pub enum CardStatus {
    Active,
    Blocked,
    Expired,
    Cancelled,
}

#[derive(Debug, Deserialize)]
pub struct CreateCardRequest {
    pub account_id: Uuid,
    pub card_type: CardType,
    pub friendly_name: String,
}

#[derive(Debug, Serialize)]
pub struct CardResponse {
    pub id: Uuid,
    pub account_id: Uuid,
    pub card_type: CardType,
    pub friendly_name: String,
    pub masked_card_number: String,
    pub expiry_month: i32,
    pub expiry_year: i32,
    pub status: CardStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct CardDetailsResponse {
    pub id: Uuid,
    pub account_id: Uuid,
    pub card_type: CardType,
    pub friendly_name: String,
    pub card_number: String,
    pub expiry_month: i32,
    pub expiry_year: i32,
    pub cvv: String,
    pub status: CardStatus,
    pub created_at: DateTime<Utc>,
}