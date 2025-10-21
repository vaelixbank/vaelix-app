# Vaelix Bank Application Makefile

.PHONY: help build up down restart logs clean install test lint format

# Default target
help: ## Show this help message
	@echo "Vaelix Bank Application Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Development commands
install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev --turbopack

build: ## Build the application
	pnpm run build

start: ## Start production server
	pnpm start

test: ## Run tests
	pnpm test

lint: ## Run linter
	pnpm lint

# Docker commands
docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start all services with Docker
	docker-compose up -d

docker-dev: ## Start development environment with Docker
	docker-compose up

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## Show Docker logs
	docker-compose logs -f

docker-clean: ## Clean Docker containers and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

# Database commands
db-up: ## Start database service
	docker-compose up -d db

db-down: ## Stop database service
	docker-compose down db

db-logs: ## Show database logs
	docker-compose logs -f db

db-reset: ## Reset database (WARNING: This will delete all data)
	docker-compose down db
	docker volume rm vaelixbank_postgres_data || true
	docker-compose up -d db

# API commands
api-build: ## Build Rust API
	cd api && cargo build

api-run: ## Run Rust API locally
	cd api && cargo run

api-test: ## Test Rust API
	cd api && cargo test

# Mobile commands
cap-init: ## Initialize Capacitor
	pnpm run cap:init

cap-android: ## Build and run Android app
	pnpm run cap:android

cap-ios: ## Build and run iOS app
	pnpm run cap:ios

cap-build: ## Build mobile apps
	pnpm run cap:build

# Utility commands
clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf api/target

format: ## Format code
	pnpm run lint --fix

deps-update: ## Update dependencies
	pnpm update
	cd api && cargo update

# Full development setup
setup: ## Full development setup
	@echo "Setting up development environment..."
	make install
	make docker-build
	make docker-up
	@echo "Development environment is ready!"
	@echo "Next.js app: http://localhost:3000"
	@echo "API: http://localhost:8080"
	@echo "Database: localhost:5432"

# Production deployment
deploy: ## Deploy to production
	@echo "Building for production..."
	make build
	make docker-build
	@echo "Ready for deployment"