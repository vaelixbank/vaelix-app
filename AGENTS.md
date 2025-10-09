# Agent Guidelines for Vaelix Bank App

## Commands
- **Build**: `npm run build` or `pnpm build`
- **Lint**: `npm run lint` or `pnpm lint`
- **Test all**: `npx vitest run`
- **Test single**: `npx vitest run path/to/test.ts`
- **Dev server**: `npm run dev` or `pnpm dev`

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Framework**: Next.js 15 with App Router, React 19
- **Port**: Default port 3000 for development server
- **State**: Zustand for global state management
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Linting**: ESLint with Next.js core web vitals rules
- **Testing**: Vitest with jsdom
- **Mobile**: Capacitor for iOS/Android builds

## Naming Conventions
- **Components**: PascalCase (e.g., `BottomNav`, `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `usePathname`, `menuItems`)
- **Interfaces**: PascalCase (e.g., `User`, `Transaction`)
- **Files**: kebab-case for pages (e.g., `bottom-nav.tsx`), camelCase for utilities

## Patterns
- Use `'use client'` directive for client components
- Import types with `import type` syntax
- Define interfaces for all data structures
- Use template literals for dynamic className strings
- Use Next.js router instead of `window.location.href`
- Follow React best practices with proper key props in maps
- Early returns for loading/error states
- useEffect for side effects, localStorage for persistence

## CapacitorJS Mobile Integration

### Apple Pay Integration
- **Plugin**: `@fresha/capacitor-plugin-applepay`
- **Installation**: `npm install @fresha/capacitor-plugin-applepay && npx cap sync`
- **iOS Setup**:
  - Add Merchant ID in Apple Developer Portal
  - Generate Apple Pay Payment Processing Certificate via PSP
  - Add Apple Pay capability in Xcode
  - Select merchant identifier in Xcode
- **Key Methods**:
  - `canMakePayments()` - Check device/payment method support
  - `canMakePayments(options)` - Granular payment method checking
  - `initiatePayment(request)` - Start Apple Pay payment sheet
  - `completeLastPayment(request)` - Complete transaction

### Google Pay Integration
- **Plugin**: `@fresha/capacitor-plugin-googlepay`
- **Installation**: `npm install @fresha/capacitor-plugin-googlepay && npx cap sync`
- **Android Setup**:
  - Plugin auto-configures AndroidManifest.xml
  - Use TEST environment for development
  - Switch to PRODUCTION for live payments
- **Key Methods**:
  - `initialize(paymentOptions)` - Configure environment (TEST/PRODUCTION)
  - `isReadyToPay(request)` - Check device/payment method availability
  - `loadPaymentData(request)` - Initiate Google Pay payment sheet
- **Testing**: Use Google's Test Card Suite for integration testing

### Wallet Card Addition
For adding cards to Apple/Google Pay wallets:
1. **Apple Pay**: Cards are added through iOS Wallet app or during payment flow
2. **Google Pay**: Cards are added through Google Pay app or during payment flow
3. **PSP Integration**: Work with payment service provider for card tokenization
4. **Security**: Never store sensitive card data - use tokens only
5. **Certification**: Ensure PCI DSS compliance for card handling