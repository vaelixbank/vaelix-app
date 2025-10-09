import { create } from 'zustand';

interface User {
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

interface AppState {
  user: User | null;
  transactions: Transaction[];
  setUser: (user: User | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  transactions: [
    { id: '1', amount: -50, description: 'Coffee Shop', date: '2023-10-01' },
    { id: '2', amount: 200, description: 'Salary', date: '2023-10-01' },
    { id: '3', amount: -20, description: 'Grocery', date: '2023-09-30' },
  ],
  setUser: (user) => set({ user }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
    user: state.user ? { ...state.user, balance: state.user.balance + transaction.amount } : null
  })),
}));