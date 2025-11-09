.PHONY: help install dev build start test docker-up docker-down clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run start:dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start:prod

test: ## Run tests
	npm run test

test-e2e: ## Run e2e tests
	npm run test:e2e

test-cov: ## Run tests with coverage
	npm run test:cov

lint: ## Lint code
	npm run lint

format: ## Format code
	npm run format

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

prisma-generate: ## Generate Prisma Client
	npm run prisma:generate

prisma-migrate: ## Run database migrations
	npm run prisma:migrate

prisma-studio: ## Open Prisma Studio
	npm run prisma:studio

prisma-seed: ## Seed database
	npm run prisma:seed

clean: ## Clean build artifacts
	rm -rf dist node_modules coverage

setup: install docker-up prisma-migrate prisma-generate ## Complete project setup

deploy: build ## Deploy to production
	@echo "Deploying to production..."
	vercel --prod
