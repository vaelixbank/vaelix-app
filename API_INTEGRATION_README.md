# Intégration API Frontend/Backend

Ce document explique comment l'application frontend se connecte à l'API backend Rust pour Vaelix Bank.

## Architecture

```
Frontend (Next.js) <---HTTP---> Backend (Rust/Axum)
     ↓                              ↓
  Zustand Store               PostgreSQL
     ↓                              ↓
  Local Storage              Redis (future)
```

## Démarrage

### 1. Backend (Rust)

```bash
cd api
cargo run
```

Le backend démarre sur `http://localhost:8080`

### 2. Frontend (Next.js)

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Le frontend démarre sur `http://localhost:3000`

## Fonctionnalités API

### 🔐 Authentification
- `POST /api/auth/login` - Connexion utilisateur
- JWT tokens stockés dans localStorage
- Middleware d'authentification automatique

### 👥 Gestion Utilisateurs
- `POST /api/consumers` - Créer un compte consommateur
- `POST /api/corporates` - Créer un compte entreprise

### 💳 Gestion Comptes & Cartes
- `POST /api/accounts` - Créer un compte géré
- `GET /api/accounts/:id/iban` - Récupérer l'IBAN
- `POST /api/cards` - Créer une carte
- `GET /api/cards/:id` - Détails d'une carte

### 💸 Transactions
- `POST /api/transactions/sends` - Envoyer de l'argent
- `POST /api/transactions/transfers` - Transférer entre comptes
- `GET /api/accounts/:id/transactions` - Historique des transactions

### 📊 Dashboard
- `GET /api/dashboard` - Vue d'ensemble avec comptes et transactions récentes

## Utilisation dans le Frontend

### Hook `useApi`

```typescript
import { useApi } from '../lib/useApi';

function MyComponent() {
  const { login, loadDashboard, isLoading, error } = useApi();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result) {
      // Connexion réussie
    }
  };

  return (
    <div>
      {isLoading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
```

### Store Zustand

Le store gère l'état local et peut être synchronisé avec l'API :

```typescript
import { useStore } from '../lib/store';

function Dashboard() {
  const { accounts, transactions, getTotalBalance } = useStore();

  return (
    <div>
      <h1>Solde total: {getTotalBalance()} €</h1>
      {/* Affichage des comptes et transactions */}
    </div>
  );
}
```

## Mode Test/Développement

### Toggle API/Mock Data

Dans le dashboard (`/dashboard`), cliquez sur l'icône 🔄 pour basculer entre :
- **Données mockées** (gris) : Utilise les données du store local
- **API** (vert) : Récupère les données depuis le backend Rust

### Page de Test API

Visitez `/api-test` pour tester directement les endpoints API.

## Configuration

### Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Configuration

```bash
# api/.env
DATABASE_URL=postgres://user:password@localhost/vaelixbank
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

## Sécurité

### Authentification
- JWT tokens avec expiration
- Stockage sécurisé dans localStorage
- Vérification automatique des tokens

### Chiffrement
- AES256-GCM pour les données sensibles
- Clés de chiffrement configurables

### Rate Limiting
- 100 requêtes/minute par IP
- Protection contre les attaques par déni de service

## Développement

### Ajouter un nouvel endpoint

1. **Backend** : Ajouter la route dans `main.rs` et l'implémentation dans les handlers
2. **Frontend** : Ajouter la méthode dans `api.ts`
3. **Hook** : Ajouter la fonction dans `useApi.ts`
4. **Store** : Mettre à jour le store si nécessaire

### Gestion d'erreurs

Toutes les erreurs API sont automatiquement gérées et affichées dans l'interface.

## Tests

### Tests API
```bash
# Backend
cd api && cargo test

# Frontend
npm run test
```

### Tests d'intégration
La page `/api-test` permet de tester tous les endpoints manuellement.

## Déploiement

### Backend
```bash
cd api
cargo build --release
./target/release/vaelix-api
```

### Frontend
```bash
npm run build
npm start
```

## Support

Pour toute question concernant l'intégration API, consultez :
- `/api-test` pour les tests manuels
- Les logs du backend pour le debugging
- La documentation des endpoints dans le code</content>
</xai:function_call">API_INTEGRATION_README.md