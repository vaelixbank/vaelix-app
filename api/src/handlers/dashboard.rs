use axum::{Json, http::StatusCode, Extension};
use serde::Serialize;
use uuid::Uuid;
use sqlx::Row;
use crate::services::database::DbPool;
use crate::services::transaction_service;
use crate::utils::jwt::Claims;


#[derive(Debug, Serialize)]
pub struct DashboardResponse {
    pub accounts: Vec<AccountSummary>,
    pub recent_transactions: Vec<TransactionSummary>,
    pub total_balance: f64,
}

#[derive(Debug, Serialize)]
pub struct AccountSummary {
    pub id: Uuid,
    pub friendly_name: String,
    pub iban: String,
    pub balance: f64,
    pub cards_count: i64,
}

#[derive(Debug, Serialize)]
pub struct TransactionSummary {
    pub id: Uuid,
    pub transaction_type: String,
    pub amount: f64,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[axum::debug_handler]
pub async fn get_dashboard(
    Extension(pool): Extension<DbPool>,
    Extension(claims): Extension<Claims>,
) -> Result<Json<DashboardResponse>, StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    // Get user accounts
    let accounts = match get_user_accounts(&pool, user_id).await {
        Ok(accounts) => accounts,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Get recent transactions (from all user accounts)
    let mut recent_transactions = Vec::new();
    let mut total_balance = 0.0;

    for account in &accounts {
        total_balance += account.balance;

        if let Ok(transactions) = transaction_service::get_transactions_by_account(&pool, account.id, Some(5), Some(0)).await {
            for transaction in transactions {
                recent_transactions.push(TransactionSummary {
                    id: transaction.id,
                    transaction_type: format!("{:?}", transaction.transaction_type),
                    amount: transaction.amount,
                    description: transaction.description,
                    created_at: transaction.created_at,
                });
            }
        }
    }

    // Sort transactions by date (most recent first) and take top 10
    recent_transactions.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    recent_transactions.truncate(10);

    let response = DashboardResponse {
        accounts,
        recent_transactions,
        total_balance,
    };

    Ok(Json(response))
}

async fn get_user_accounts(pool: &DbPool, user_id: Uuid) -> Result<Vec<AccountSummary>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, friendly_name, iban, balance FROM accounts WHERE user_id = $1"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    let mut accounts = Vec::new();
    for row in rows {
        let account_id: Uuid = row.try_get("id")?;

        // Count cards for this account
        let cards_count = sqlx::query("SELECT COUNT(*) as count FROM cards WHERE account_id = $1")
            .bind(account_id)
            .fetch_one(pool)
            .await?
            .try_get::<i64, _>("count")?;

        accounts.push(AccountSummary {
            id: account_id,
            friendly_name: row.try_get("friendly_name")?,
            iban: row.try_get("iban")?,
            balance: row.try_get("balance")?,
            cards_count,
        });
    }

    Ok(accounts)
}