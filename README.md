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
