# VaelixBank App

The Vaelix Bank Client App with Web and Mobile Support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

## 🐳 Docker Development

This project includes Docker configuration for easy development setup.

### Quick Start with Docker

```bash
# Start the full development environment
make setup

# Or manually:
make docker-build
make docker-up
```

The application will be available at:
- **Next.js App**: http://localhost:3000
- **Rust API**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Docker Commands

```bash
# Build Docker images
make docker-build

# Start services
make docker-up

# Start with logs (development mode)
make docker-dev

# Stop services
make docker-down

# View logs
make docker-logs

# Clean up
make docker-clean
```

### Database Management

```bash
# Start database
make db-up

# Reset database (WARNING: deletes all data)
make db-reset

# View database logs
make db-logs
```

## 🛠️ Development Commands

Use the Makefile for common development tasks:

```bash
# Show all available commands
make help

# Install dependencies
make install

# Start development server
make dev

# Build application
make build

# Run tests
make test

# Run linter
make lint

# Format code
make format

# Update dependencies
make deps-update

# Clean build artifacts
make clean
```

### API Development

```bash
# Build Rust API
make api-build

# Run API locally
make api-run

# Test API
make api-test
```

## 📱 Mobile Builds

This app uses Capacitor for mobile deployment on Android and iOS.

### Android Build
```bash
# Build and run on connected device/emulator
pnpm cap:android

# Build APK only
pnpm cap:android:build

# Open Android project in Android Studio
pnpm cap:android:open
```

### iOS Build
```bash
# Build and run on connected device/simulator
pnpm cap:ios

# Build IPA only
pnpm cap:ios:build

# Open iOS project in Xcode
pnpm cap:ios:open
```

### Build Process
1. **Static Export**: `pnpm build:static` - Exports Next.js app as static files
2. **Capacitor Sync**: `npx cap sync` - Copies web assets to native projects
3. **Native Build**: `npx cap build [platform]` - Builds the native app

### First Time Setup
```bash
# Install dependencies
pnpm install

# Initialize Capacitor (build + sync)
pnpm cap:init

# Add platforms
pnpm cap:add:android
pnpm cap:add:ios
```

### Development Workflow
```bash
# For web development
pnpm dev

# For mobile development (after setup)
pnpm cap:android:open  # Open in Android Studio
pnpm cap:ios:open      # Open in Xcode
```

## 🛠️ Available Scripts

### Development
- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm build:static` - Build static export for Capacitor
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Mobile Development
- `pnpm cap:init` - Initialize Capacitor (build + sync)
- `pnpm cap:build` - Build and sync for Capacitor
- `pnpm cap:add:android` - Add Android platform
- `pnpm cap:add:ios` - Add iOS platform
- `pnpm cap:android` - Build and run Android app
- `pnpm cap:ios` - Build and run iOS app
- `pnpm cap:android:build` - Build Android APK only
- `pnpm cap:ios:build` - Build iOS IPA only
- `pnpm cap:android:open` - Open Android project in Android Studio
- `pnpm cap:ios:open` - Open iOS project in Xcode

## 📋 Features

- Modern React/Next.js web app
- Mobile app support via Capacitor
- Dark theme (gray/black)
- Responsive design
- Banking features (transfers, cards, crypto, etc.)

## 📝 Licence
This Project is used the Apache 2.0 Licence see [LICENSE](LICENSE) for more information.
