use crate::models::card::{Card, CreateCardRequest, CardResponse, CardDetailsResponse, CardType, CardStatus};
use crate::services::database::DbPool;
use crate::services::encryption_service::EncryptionService;
use sqlx::Row;
use uuid::Uuid;
use chrono::{Utc, Datelike};

pub async fn create_card(
    pool: &DbPool,
    request: CreateCardRequest,
) -> Result<CardResponse, sqlx::Error> {
    let card_id = Uuid::new_v4();

    // Generate mock card details (in production, this would come from Weavr API)
    let (card_number, expiry_month, expiry_year, cvv) = generate_mock_card_details();

    // TODO: Encrypt sensitive data
    let card_number_encrypted = Some(card_number.clone());
    let cvv_encrypted = Some(cvv.clone());

    sqlx::query(
        "INSERT INTO cards (id, account_id, card_type, friendly_name, card_number_encrypted, expiry_month, expiry_year, cvv_encrypted, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
    )
    .bind(card_id)
    .bind(request.account_id)
    .bind(format!("{:?}", request.card_type).to_lowercase())
    .bind(&request.friendly_name)
    .bind(&card_number_encrypted)
    .bind(expiry_month)
    .bind(expiry_year)
    .bind(&cvv_encrypted)
    .bind("active")
    .execute(pool)
    .await?;

    Ok(CardResponse {
        id: card_id,
        account_id: request.account_id,
        card_type: request.card_type,
        friendly_name: request.friendly_name,
        masked_card_number: mask_card_number(&card_number),
        expiry_month,
        expiry_year,
        status: CardStatus::Active,
        created_at: Utc::now(),
    })
}

pub async fn get_card(
    pool: &DbPool,
    card_id: Uuid,
) -> Result<Option<Card>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, account_id, card_type, friendly_name, card_number_encrypted, expiry_month, expiry_year, cvv_encrypted, status, created_at FROM cards WHERE id = $1"
    )
    .bind(card_id)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        let card = Card {
            id: row.try_get("id")?,
            account_id: row.try_get("account_id")?,
            card_type: row.try_get("card_type")?,
            friendly_name: row.try_get("friendly_name")?,
            card_number_encrypted: row.try_get("card_number_encrypted")?,
            expiry_month: row.try_get("expiry_month")?,
            expiry_year: row.try_get("expiry_year")?,
            cvv_encrypted: row.try_get("cvv_encrypted")?,
            status: row.try_get("status")?,
            created_at: row.try_get("created_at")?,
        };
        Ok(Some(card))
    } else {
        Ok(None)
    }
}

pub async fn get_card_details(
    pool: &DbPool,
    card_id: Uuid,
) -> Result<Option<CardDetailsResponse>, sqlx::Error> {
    let card = get_card(pool, card_id).await?;

    if let Some(card) = card {
        // TODO: Decrypt sensitive data
        let card_number = card.card_number_encrypted.unwrap_or_else(|| "4111111111111111".to_string());
        let cvv = card.cvv_encrypted.unwrap_or_else(|| "123".to_string());

        Ok(Some(CardDetailsResponse {
            id: card.id,
            account_id: card.account_id,
            card_type: card.card_type,
            friendly_name: card.friendly_name,
            card_number,
            expiry_month: card.expiry_month,
            expiry_year: card.expiry_year,
            cvv,
            status: card.status,
            created_at: card.created_at,
        }))
    } else {
        Ok(None)
    }
}

pub async fn get_cards_by_account(
    pool: &DbPool,
    account_id: Uuid,
) -> Result<Vec<CardResponse>, sqlx::Error> {
    let rows = sqlx::query(
        "SELECT id, account_id, card_type, friendly_name, card_number_encrypted, expiry_month, expiry_year, status, created_at FROM cards WHERE account_id = $1"
    )
    .bind(account_id)
    .fetch_all(pool)
    .await?;

    let mut cards = Vec::new();
    for row in rows {
        let card_number = row.try_get::<Option<String>, _>("card_number_encrypted")?
            .unwrap_or_else(|| "4111111111111111".to_string());

        cards.push(CardResponse {
            id: row.try_get("id")?,
            account_id: row.try_get("account_id")?,
            card_type: row.try_get("card_type")?,
            friendly_name: row.try_get("friendly_name")?,
            masked_card_number: mask_card_number(&card_number),
            expiry_month: row.try_get("expiry_month")?,
            expiry_year: row.try_get("expiry_year")?,
            status: row.try_get("status")?,
            created_at: row.try_get("created_at")?,
        });
    }

    Ok(cards)
}

fn generate_mock_card_details() -> (String, i32, i32, String) {
    // Generate mock card details for testing
    let card_number = format!("411111111111{}", 1000 + (rand::random::<u32>() % 9000));
    let expiry_month = ((Utc::now().month() as i32 - 1 + 6) % 12) + 1; // 6 months from now
    let expiry_year = Utc::now().year() as i32 + 3;
    let cvv = format!("{:03}", rand::random::<u32>() % 1000);

    (card_number, expiry_month, expiry_year, cvv)
}

pub fn mask_card_number(card_number: &str) -> String {
    if card_number.len() < 4 {
        return "****".to_string();
    }

    let last_four = &card_number[card_number.len() - 4..];
    format!("**** **** **** {}", last_four)
}