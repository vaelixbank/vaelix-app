use crate::models::transaction::{Transaction, SendMoneyRequest, TransferRequest, TransactionResponse, TransactionType, TransactionStatus};
use crate::services::database::DbPool;
use sqlx::Row;
use uuid::Uuid;
use chrono::Utc;

pub async fn send_money(
    pool: &DbPool,
    request: SendMoneyRequest,
) -> Result<TransactionResponse, sqlx::Error> {
    let transaction_id = Uuid::new_v4();

    sqlx::query(
        "INSERT INTO transactions (id, account_id, transaction_type, amount, currency, description, beneficiary_name, beneficiary_iban, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
    )
    .bind(transaction_id)
    .bind(request.account_id)
    .bind("send")
    .bind(request.amount)
    .bind(&request.currency)
    .bind(&request.description)
    .bind(&request.beneficiary_name)
    .bind(&request.beneficiary_iban)
    .bind("pending")
    .execute(pool)
    .await?;

    Ok(TransactionResponse {
        id: transaction_id,
        account_id: request.account_id,
        transaction_type: TransactionType::Send,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        beneficiary_name: Some(request.beneficiary_name),
        beneficiary_iban: Some(request.beneficiary_iban),
        status: TransactionStatus::Pending,
        created_at: Utc::now(),
    })
}

pub async fn transfer_money(
    pool: &DbPool,
    request: TransferRequest,
) -> Result<TransactionResponse, sqlx::Error> {
    let transaction_id = Uuid::new_v4();

    // Get beneficiary IBAN from the to_account
    let beneficiary_iban = sqlx::query("SELECT iban FROM accounts WHERE id = $1")
        .bind(request.to_account_id)
        .fetch_optional(pool)
        .await?
        .and_then(|row| row.try_get("iban").ok())
        .flatten();

    sqlx::query(
        "INSERT INTO transactions (id, account_id, transaction_type, amount, currency, description, beneficiary_iban, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    )
    .bind(transaction_id)
    .bind(request.from_account_id)
    .bind("transfer")
    .bind(request.amount)
    .bind(&request.currency)
    .bind(&request.description)
    .bind(&beneficiary_iban)
    .bind("pending")
    .execute(pool)
    .await?;

    Ok(TransactionResponse {
        id: transaction_id,
        account_id: request.from_account_id,
        transaction_type: TransactionType::Transfer,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        beneficiary_name: None,
        beneficiary_iban: beneficiary_iban,
        status: TransactionStatus::Pending,
        created_at: Utc::now(),
    })
}

pub async fn get_transactions_by_account(
    pool: &DbPool,
    account_id: Uuid,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Vec<TransactionResponse>, sqlx::Error> {
    let limit = limit.unwrap_or(50);
    let offset = offset.unwrap_or(0);

    let rows = sqlx::query(
        "SELECT id, account_id, transaction_type, amount, currency, description, beneficiary_name, beneficiary_iban, status, created_at FROM transactions WHERE account_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3"
    )
    .bind(account_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let mut transactions = Vec::new();
    for row in rows {
        transactions.push(TransactionResponse {
            id: row.try_get("id")?,
            account_id: row.try_get("account_id")?,
            transaction_type: row.try_get("transaction_type")?,
            amount: row.try_get("amount")?,
            currency: row.try_get("currency")?,
            description: row.try_get("description")?,
            beneficiary_name: row.try_get("beneficiary_name")?,
            beneficiary_iban: row.try_get("beneficiary_iban")?,
            status: row.try_get("status")?,
            created_at: row.try_get("created_at")?,
        });
    }

    Ok(transactions)
}

pub async fn get_transaction(
    pool: &DbPool,
    transaction_id: Uuid,
) -> Result<Option<TransactionResponse>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, account_id, transaction_type, amount, currency, description, beneficiary_name, beneficiary_iban, status, created_at FROM transactions WHERE id = $1"
    )
    .bind(transaction_id)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        Ok(Some(TransactionResponse {
            id: row.try_get("id")?,
            account_id: row.try_get("account_id")?,
            transaction_type: row.try_get("transaction_type")?,
            amount: row.try_get("amount")?,
            currency: row.try_get("currency")?,
            description: row.try_get("description")?,
            beneficiary_name: row.try_get("beneficiary_name")?,
            beneficiary_iban: row.try_get("beneficiary_iban")?,
            status: row.try_get("status")?,
            created_at: row.try_get("created_at")?,
        }))
    } else {
        Ok(None)
    }
}