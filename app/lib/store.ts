import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'business' | 'crypto';
  balance: number;
  currency: string;
  color: string;
  iban?: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  accounts: Account[];
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    biometricAuth: boolean;
  };
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  accountId: string;
  recipientId?: string;
  metadata?: Record<string, any>;
}

export interface WalletCard {
  id: string;
  cardId: string;
  walletType: 'apple_pay' | 'google_pay';
  status: 'active' | 'pending' | 'failed';
  addedAt: string;
  lastUsed?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  variant: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  isEnabled: boolean;
}

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  accounts: Account[];
  transactions: Transaction[];
  walletCards: WalletCard[];
  quickActions: QuickAction[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedAccountId: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Accounts
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  deleteAccount: (accountId: string) => void;
  selectAccount: (accountId: string | null) => void;
  
  // Transactions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (transactionId: string) => void;
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  
  // Wallet Cards
  addWalletCard: (walletCard: WalletCard) => void;
  updateWalletCard: (cardId: string, updates: Partial<WalletCard>) => void;
  removeWalletCard: (cardId: string) => void;
  getWalletCards: () => WalletCard[];
  
  // Quick Actions
  setQuickActions: (actions: QuickAction[]) => void;
  toggleQuickAction: (actionId: string) => void;
  
  // Computed values
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getSavingsRate: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        id: '1',
        email: 'user@vaelixbank.com',
        name: 'John Doe',
        avatar: '',
        phone: '+33 6 12 34 56 78',
        accounts: [
          {
            id: '1',
            name: 'Compte Principal',
            type: 'checking',
            balance: 2450.50,
            currency: 'EUR',
            color: '#3b82f6',
            iban: 'FR76 1234 5678 9012 3456 7890 123',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Épargne',
            type: 'savings',
            balance: 5200.00,
            currency: 'EUR',
            color: '#10b981',
            iban: 'FR76 1234 5678 9012 3456 7890 124',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '3',
            name: 'Investissement',
            type: 'investment',
            balance: 12800.75,
            currency: 'EUR',
            color: '#f59e0b',
            iban: 'FR76 1234 5678 9012 3456 7890 125',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z'
          }
        ],
        preferences: {
          currency: 'EUR',
          language: 'fr',
          notifications: true,
          biometricAuth: true
        },
        createdAt: '2024-01-01T00:00:00Z'
      },
      isAuthenticated: true,
      accounts: [],
      transactions: [
        { 
          id: '1', 
          amount: -15.50, 
          description: 'Café du coin', 
          date: '2024-01-15T08:30:00Z',
          category: 'food',
          type: 'expense',
          status: 'completed',
          merchant: 'Café du coin',
          accountId: '1'
        },
        { 
          id: '2', 
          amount: 3500, 
          description: 'Salaire', 
          date: '2024-01-15T09:00:00Z',
          category: 'salary',
          type: 'income',
          status: 'completed',
          accountId: '1'
        },
        { 
          id: '3', 
          amount: -89.99, 
          description: 'Courses', 
          date: '2024-01-14T18:45:00Z',
          category: 'shopping',
          type: 'expense',
          status: 'completed',
          merchant: 'Supermarket',
          accountId: '1'
        },
        { 
          id: '4', 
          amount: -45.20, 
          description: 'Transport', 
          date: '2024-01-14T07:20:00Z',
          category: 'transport',
          type: 'expense',
          status: 'completed',
          merchant: 'RATP',
          accountId: '1'
        },
        { 
          id: '5', 
          amount: 200, 
          description: 'Virement épargne', 
          date: '2024-01-13T10:00:00Z',
          category: 'transfer',
          type: 'transfer',
          status: 'completed',
          accountId: '1',
          recipientId: '2'
        }
      ],
      walletCards: [],
      quickActions: [
        {
          id: '1',
          title: 'Envoyer',
          description: 'Transférer de l\'argent',
          icon: 'ArrowUpRight',
          href: '/send',
          variant: 'primary',
          isEnabled: true
        },
        {
          id: '2',
          title: 'Demander',
          description: 'Demander un paiement',
          icon: 'ArrowDownLeft',
          href: '/request',
          variant: 'success',
          isEnabled: true
        },
        {
          id: '3',
          title: 'Recharger',
          description: 'Recharger le compte',
          icon: 'TrendingUp',
          href: '/topup',
          variant: 'default',
          isEnabled: true
        },
        {
          id: '4',
          title: 'Cartes',
          description: 'Gérer les cartes',
          icon: 'CreditCard',
          href: '/cards',
          variant: 'default',
          isEnabled: true
        }
      ],
      isLoading: false,
      error: null,
      selectedAccountId: '1',

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Accounts
      setAccounts: (accounts) => set({ accounts }),
      addAccount: (account) => set((state) => ({ 
        accounts: [...state.accounts, account] 
      })),
      updateAccount: (accountId, updates) => set((state) => ({
        accounts: state.accounts.map(account =>
          account.id === accountId ? { ...account, ...updates } : account
        )
      })),
      deleteAccount: (accountId) => set((state) => ({
        accounts: state.accounts.filter(account => account.id !== accountId)
      })),
      selectAccount: (accountId) => set({ selectedAccountId: accountId }),

      // Transactions
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions],
        accounts: state.accounts.map(account =>
          account.id === transaction.accountId
            ? { ...account, balance: account.balance + transaction.amount }
            : account
        )
      })),
      updateTransaction: (transactionId, updates) => set((state) => ({
        transactions: state.transactions.map(transaction =>
          transaction.id === transactionId ? { ...transaction, ...updates } : transaction
        )
      })),
      deleteTransaction: (transactionId) => set((state) => ({
        transactions: state.transactions.filter(transaction => transaction.id !== transactionId)
      })),
      getTransactionsByAccount: (accountId) => {
        return get().transactions.filter(transaction => transaction.accountId === accountId);
      },
      getTransactionsByCategory: (category) => {
        return get().transactions.filter(transaction => transaction.category === category);
      },

      // Wallet Cards
      addWalletCard: (walletCard) => set((state) => ({
        walletCards: [...state.walletCards, walletCard]
      })),
      updateWalletCard: (cardId, updates) => set((state) => ({
        walletCards: state.walletCards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        )
      })),
      removeWalletCard: (cardId) => set((state) => ({
        walletCards: state.walletCards.filter(card => card.id !== cardId)
      })),
      getWalletCards: () => get().walletCards,

      // Quick Actions
      setQuickActions: (actions) => set({ quickActions: actions }),
      toggleQuickAction: (actionId) => set((state) => ({
        quickActions: state.quickActions.map(action =>
          action.id === actionId ? { ...action, isEnabled: !action.isEnabled } : action
        )
      })),

      // Computed values
      getTotalBalance: () => {
        const accounts = get().accounts;
        return accounts.reduce((total, account) => total + account.balance, 0);
      },
      getAccountBalance: (accountId) => {
        const account = get().accounts.find(acc => acc.id === accountId);
        return account ? account.balance : 0;
      },
      getMonthlyIncome: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return get().transactions
          .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
          .reduce((total, t) => total + t.amount, 0);
      },
      getMonthlyExpenses: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return get().transactions
          .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
          .reduce((total, t) => total + Math.abs(t.amount), 0);
      },
      getSavingsRate: () => {
        const income = get().getMonthlyIncome();
        const expenses = get().getMonthlyExpenses();
        return income > 0 ? ((income - expenses) / income) * 100 : 0;
      },
    }),
    {
      name: 'vaelix-bank-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accounts: state.accounts,
        transactions: state.transactions,
        walletCards: state.walletCards,
        quickActions: state.quickActions,
        selectedAccountId: state.selectedAccountId,
      }),
    }
  )
);