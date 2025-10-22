use sqlx::{PgPool, postgres::PgPoolOptions};
use crate::config::app_config::AppConfig;

pub type DbPool = PgPool;

pub async fn create_pool(config: &AppConfig) -> Result<DbPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
}

pub async fn run_migrations(pool: &DbPool) -> Result<(), sqlx::Error> {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await?;
    Ok(())
}