use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Transaction {
    pub id: Uuid,
    pub account_id: Uuid,
    pub transaction_type: TransactionType,
    pub amount: f64,
    pub currency: String,
    pub description: Option<String>,
    pub beneficiary_name: Option<String>,
    pub beneficiary_iban: Option<String>,
    pub status: TransactionStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "transaction_type", rename_all = "lowercase")]
pub enum TransactionType {
    Send,
    Transfer,
    Receive,
    WireTransfer,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "transaction_status", rename_all = "lowercase")]
pub enum TransactionStatus {
    Pending,
    Processing,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Deserialize)]
pub struct SendMoneyRequest {
    pub account_id: Uuid,
    pub amount: f64,
    pub currency: String,
    pub description: Option<String>,
    pub beneficiary_name: String,
    pub beneficiary_iban: String,
}

#[derive(Debug, Deserialize)]
pub struct TransferRequest {
    pub from_account_id: Uuid,
    pub to_account_id: Uuid,
    pub amount: f64,
    pub currency: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub id: Uuid,
    pub account_id: Uuid,
    pub transaction_type: TransactionType,
    pub amount: f64,
    pub currency: String,
    pub description: Option<String>,
    pub beneficiary_name: Option<String>,
    pub beneficiary_iban: Option<String>,
    pub status: TransactionStatus,
    pub created_at: DateTime<Utc>,
}