import axiosInstance from '.';
import { API_CONFIG } from '../config/api';
import type { ApiResponse } from '../../interface/api';

interface BalanceResponse {
  balance: number;
  transactions: Array<{
    id: number;
    type: 'credit' | 'debit';
    amount: number;
    action: string | null;
    balance_after: number;
    created_at: string;
  }>;
}

interface PurchasesResponse {
  purchases: Array<{
    id: string;
    amount_cents: number;
    tokens_granted: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    fulfilled_at: string | null;
  }>;
}

interface CheckoutResponse {
  checkout_url: string;
}

export const paymentService = {
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await axiosInstance.get<ApiResponse<BalanceResponse>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.BALANCE
    );
    return response.data.data;
  },

  getPurchases: async (): Promise<PurchasesResponse> => {
    const response = await axiosInstance.get<ApiResponse<PurchasesResponse>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.PURCHASES
    );
    return response.data.data;
  },

  createCheckout: async (plan: 'creator' | 'pro'): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<CheckoutResponse>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.CHECKOUT,
      { plan }
    );
    return response.data.data.checkout_url;
  },
};

export type { BalanceResponse, PurchasesResponse };
