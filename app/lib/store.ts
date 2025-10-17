import { create } from 'zustand';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  color: string;
}

export interface User {
  email: string;
  name?: string;
  accounts: Account[];
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface WalletCard {
  id: string;
  cardId: string;
  walletType: 'apple_pay' | 'google_pay';
  status: 'active' | 'pending' | 'failed';
  addedAt: string;
}

interface AppState {
  user: User | null;
  transactions: Transaction[];
  walletCards: WalletCard[];
  setUser: (user: User | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction, accountId?: string) => void;
  addWalletCard: (walletCard: WalletCard) => void;
  getWalletCards: () => WalletCard[];
  getTotalBalance: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  user: {
    email: 'user@example.com',
    name: 'John Doe',
    accounts: [
      {
        id: '1',
        name: 'Main Account',
        type: 'checking',
        balance: 2450.50,
        currency: 'EUR',
        color: '#00d09c'
      },
      {
        id: '2',
        name: 'Savings',
        type: 'savings',
        balance: 5200.00,
        currency: 'EUR',
        color: '#0077be'
      },
      {
        id: '3',
        name: 'Investment',
        type: 'investment',
        balance: 12800.75,
        currency: 'EUR',
        color: '#ff6b6b'
      }
    ]
  },
  transactions: [
    { id: '1', amount: -50, description: 'Coffee Shop', date: '2023-10-01' },
    { id: '2', amount: 200, description: 'Salary', date: '2023-10-01' },
    { id: '3', amount: -20, description: 'Grocery', date: '2023-09-30' },
  ],
  walletCards: [],
  setUser: (user) => set({ user }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction, accountId = '1') => set((state) => ({
    transactions: [transaction, ...state.transactions],
    user: state.user ? {
      ...state.user,
      accounts: state.user.accounts.map(account =>
        account.id === accountId
          ? { ...account, balance: account.balance + transaction.amount }
          : account
      )
    } : null
  })),
  addWalletCard: (walletCard) => set((state) => ({
    walletCards: [...state.walletCards, walletCard]
  })),
  getWalletCards: () => get().walletCards,
  getTotalBalance: () => {
    const user = get().user;
    return user ? user.accounts.reduce((total, account) => total + account.balance, 0) : 0;
  },
}));