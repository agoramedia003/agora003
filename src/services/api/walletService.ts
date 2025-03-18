import apiClient from "./apiClient";
import { Transaction } from "../../types/wallet";

export interface WalletBalance {
  balance: number;
  pendingTransactions: number;
}

export interface TransferCoinsRequest {
  phone: string;
  amount: number;
  description: string;
}

export interface RedeemCoinsRequest {
  amount: number;
  description: string;
}

export interface TransactionFilters {
  type?: "add" | "spend" | "receive" | "send";
  limit?: number;
  offset?: number;
}

const WalletService = {
  /**
   * Get wallet balance
   */
  getBalance: async (): Promise<WalletBalance> => {
    return apiClient.get<WalletBalance>("/wallet/balance");
  },

  /**
   * Transfer coins to another user
   */
  transferCoins: async (data: TransferCoinsRequest): Promise<Transaction> => {
    return apiClient.post<Transaction>("/wallet/transfer", data);
  },

  /**
   * Get transaction history with optional filters
   */
  getTransactions: async (
    filters?: TransactionFilters,
  ): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>("/wallet/transactions", filters);
  },

  /**
   * Use coins for payment
   */
  useCoinsForPayment: async (
    data: RedeemCoinsRequest,
  ): Promise<{
    success: boolean;
    transaction: Transaction;
    newBalance: number;
  }> => {
    return apiClient.post<{
      success: boolean;
      transaction: Transaction;
      newBalance: number;
    }>("/wallet/redeem", data);
  },
};

export default WalletService;
