import { create } from 'zustand';

export interface User {
  email: string;
  name?: string;
  balance: number;
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
  addTransaction: (transaction: Transaction) => void;
  addWalletCard: (walletCard: WalletCard) => void;
  getWalletCards: () => WalletCard[];
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  transactions: [
    { id: '1', amount: -50, description: 'Coffee Shop', date: '2023-10-01' },
    { id: '2', amount: 200, description: 'Salary', date: '2023-10-01' },
    { id: '3', amount: -20, description: 'Grocery', date: '2023-09-30' },
  ],
  walletCards: [],
  setUser: (user) => set({ user }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
    user: state.user ? { ...state.user, balance: state.user.balance + transaction.amount } : null
  })),
  addWalletCard: (walletCard) => set((state) => ({
    walletCards: [...state.walletCards, walletCard]
  })),
  getWalletCards: () => get().walletCards,
}));