import { useState, useEffect, useCallback } from 'react';
import { apiClient, handleApiResponse, type ApiResponse } from './api';
import { useStore } from './store';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated, setUser, setAccounts, setTransactions } = useStore();

  // Initialize API client with token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiClient.setToken(token);
    }
  }, []);

  const executeApiCall = useCallback(async <T,>(
    apiCall: () => Promise<ApiResponse<T>>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
      showError?: boolean;
    } = {}
  ): Promise<T | null> => {
    const { onSuccess, onError, showError = true } = options;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = handleApiResponse(response);

      onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);

      if (showError) {
        console.error('API Error:', errorMessage);
      }

      onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return executeApiCall(
      () => apiClient.login({ email, password }),
      {
        onSuccess: (data) => {
          // Store token
          localStorage.setItem('auth_token', data.token);
          apiClient.setToken(data.token);

          // Data is used above, this comment avoids the unused variable warning

          // Update store
          setAuthenticated(true);
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            accounts: [], // Will be loaded separately
            preferences: {
              currency: 'EUR',
              language: 'fr',
              notifications: true,
              biometricAuth: false,
            },
            createdAt: new Date().toISOString(),
          });
        },
      }
    );
  }, [executeApiCall, setAuthenticated, setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
    setAuthenticated(false);
    setUser(null);
  }, [setAuthenticated, setUser]);

  const loadDashboard = useCallback(async () => {
    return executeApiCall(
      () => apiClient.getDashboard(),
      {
        onSuccess: (data) => {
          // Update accounts in store
          const accounts = data.accounts.map(account => ({
            id: account.id,
            name: account.friendly_name,
            type: 'checking' as const, // Default type
            balance: account.balance,
            currency: 'EUR',
            color: '#3b82f6', // Default color
            iban: account.iban,
            isActive: true,
            createdAt: new Date().toISOString(),
          }));
          setAccounts(accounts);

          // Update transactions in store
          const transactions = data.recent_transactions.map(tx => ({
            id: tx.id,
            amount: tx.amount,
            description: tx.description || 'Transaction',
            date: tx.created_at,
            type: tx.transaction_type === 'send' ? 'expense' as const :
                  tx.transaction_type === 'receive' ? 'income' as const : 'transfer' as const,
            status: 'completed' as const,
            accountId: '', // Will be set based on context
          }));
          setTransactions(transactions);
        },
      }
    );
  }, [executeApiCall, setAccounts, setTransactions]);

  const createAccount = useCallback(async (profileId: string, friendlyName: string) => {
    return executeApiCall(
      () => apiClient.createAccount({ profile_id: profileId, friendly_name: friendlyName }),
      {
        onSuccess: (data) => {
          // Optionally refresh accounts
          loadDashboard();
        },
      }
    );
  }, [executeApiCall, loadDashboard]);

  const createCard = useCallback(async (accountId: string, cardType: 'virtual' | 'physical', friendlyName: string) => {
    return executeApiCall(
      () => apiClient.createCard({ account_id: accountId, card_type: cardType, friendly_name: friendlyName }),
      {
        onSuccess: () => {
          // Optionally refresh data
          loadDashboard();
        },
      }
    );
  }, [executeApiCall, loadDashboard]);

  const sendMoney = useCallback(async (
    accountId: string,
    amount: number,
    beneficiaryName: string,
    beneficiaryIban: string,
    description?: string
  ) => {
    return executeApiCall(
      () => apiClient.sendMoney({
        account_id: accountId,
        amount,
        currency: 'EUR',
        description,
        beneficiary_name: beneficiaryName,
        beneficiary_iban: beneficiaryIban,
      }),
      {
        onSuccess: () => {
          // Refresh dashboard data
          loadDashboard();
        },
      }
    );
  }, [executeApiCall, loadDashboard]);

  const transferMoney = useCallback(async (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string
  ) => {
    return executeApiCall(
      () => apiClient.transferMoney({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount,
        currency: 'EUR',
        description,
      }),
      {
        onSuccess: () => {
          // Refresh dashboard data
          loadDashboard();
        },
      }
    );
  }, [executeApiCall, loadDashboard]);

  return {
    // State
    isLoading,
    error,

    // Methods
    login,
    logout,
    loadDashboard,
    createAccount,
    createCard,
    sendMoney,
    transferMoney,

    // Utilities
    executeApiCall,
  };
}