use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey, errors::Error};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub exp: usize, // expiration time
    pub iat: usize, // issued at
}

pub fn create_token(user_id: &str, email: &str, secret: &str, expires_in_hours: i64) -> Result<String, Error> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(expires_in_hours))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        email: email.to_owned(),
        exp: expiration,
        iat: Utc::now().timestamp() as usize,
    };

    let header = Header::new(Algorithm::HS256);
    let encoding_key = EncodingKey::from_secret(secret.as_ref());

    encode(&header, &claims, &encoding_key)
}

pub fn verify_token(token: &str, secret: &str) -> Result<Claims, Error> {
    let decoding_key = DecodingKey::from_secret(secret.as_ref());
    let validation = Validation::new(Algorithm::HS256);

    let token_data = decode::<Claims>(token, &decoding_key, &validation)?;
    Ok(token_data.claims)
}

pub fn create_access_token(user_id: &str, email: &str, secret: &str) -> Result<String, Error> {
    create_token(user_id, email, secret, 1) // 1 hour
}

pub fn create_refresh_token(user_id: &str, email: &str, secret: &str) -> Result<String, Error> {
    create_token(user_id, email, secret, 24 * 7) // 7 days
}