// API client for Vaelix Bank backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
  };
}

export interface CreateUserRequest {
  email: string;
  name: string;
  user_type: 'consumer' | 'corporate';
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  user_type: string;
  created_at: string;
}

export interface CreateAccountRequest {
  profile_id: string;
  friendly_name: string;
}

export interface AccountResponse {
  id: string;
  profile_id: string;
  friendly_name: string;
  iban: string;
}

export interface DashboardResponse {
  accounts: AccountSummary[];
  recent_transactions: TransactionSummary[];
  total_balance: number;
}

export interface AccountSummary {
  id: string;
  friendly_name: string;
  iban: string;
  balance: number;
  cards_count: number;
}

export interface TransactionSummary {
  id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  created_at: string;
}

export interface CreateCardRequest {
  account_id: string;
  card_type: 'virtual' | 'physical';
  friendly_name: string;
}

export interface CardResponse {
  id: string;
  account_id: string;
  card_type: 'virtual' | 'physical';
  friendly_name: string;
  masked_card_number: string;
  expiry_month: number;
  expiry_year: number;
  status: 'active' | 'blocked' | 'expired' | 'cancelled';
  created_at: string;
}

export interface SendMoneyRequest {
  account_id: string;
  amount: number;
  currency: string;
  description?: string;
  beneficiary_name: string;
  beneficiary_iban: string;
}

export interface TransferRequest {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface TransactionResponse {
  id: string;
  account_id: string;
  transaction_type: 'send' | 'transfer' | 'receive' | 'wire_transfer';
  amount: number;
  currency: string;
  description?: string;
  beneficiary_name?: string;
  beneficiary_iban?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Users
  async createConsumer(userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/api/consumers', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async createCorporate(userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/api/corporates', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Accounts
  async createAccount(accountData: CreateAccountRequest): Promise<ApiResponse<AccountResponse>> {
    return this.request<AccountResponse>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async getAccountIban(accountId: string): Promise<ApiResponse<{ iban: string }>> {
    return this.request<{ iban: string }>(`/api/accounts/${accountId}/iban`);
  }

  // Cards
  async createCard(cardData: CreateCardRequest): Promise<ApiResponse<CardResponse>> {
    return this.request<CardResponse>('/api/cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async getCard(cardId: string): Promise<ApiResponse<CardResponse>> {
    return this.request<CardResponse>(`/api/cards/${cardId}`);
  }

  async getCardDetails(cardId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/cards/${cardId}/details`);
  }

  async getCardsByAccount(accountId: string): Promise<ApiResponse<CardResponse[]>> {
    return this.request<CardResponse[]>(`/api/accounts/${accountId}/cards`);
  }

  // Transactions
  async sendMoney(transactionData: SendMoneyRequest): Promise<ApiResponse<TransactionResponse>> {
    return this.request<TransactionResponse>('/api/transactions/sends', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async transferMoney(transactionData: TransferRequest): Promise<ApiResponse<TransactionResponse>> {
    return this.request<TransactionResponse>('/api/transactions/transfers', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactionsByAccount(
    accountId: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<TransactionResponse[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const query = params.toString();
    const endpoint = `/api/accounts/${accountId}/transactions${query ? `?${query}` : ''}`;

    return this.request<TransactionResponse[]>(endpoint);
  }

  async getTransaction(transactionId: string): Promise<ApiResponse<TransactionResponse>> {
    return this.request<TransactionResponse>(`/api/transactions/${transactionId}`);
  }

  // Beneficiaries
  async createBeneficiary(beneficiaryData: any): Promise<ApiResponse<any>> {
    return this.request('/api/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  async getBeneficiaries(): Promise<ApiResponse<any[]>> {
    return this.request('/api/beneficiaries');
  }

  async deleteBeneficiary(beneficiaryId: string): Promise<ApiResponse<void>> {
    return this.request(`/api/beneficiaries/${beneficiaryId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    return this.request<DashboardResponse>('/api/dashboard');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to handle API responses
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || !response.data) {
    throw new Error(response.error || 'API request failed');
  }
  return response.data;
}