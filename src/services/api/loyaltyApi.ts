import apiClient from "./apiClient";
import { RewardCard, GiftCard, CoinsCard } from "../../types/loyalty";

export interface ActivateCardRequest {
  code: string;
}

export interface ActivateStampRequest {
  cardId: string;
  code: string;
}

const loyaltyApi = {
  // Cards management
  getUserCards: async (): Promise<(RewardCard | GiftCard | CoinsCard)[]> => {
    return apiClient.get<(RewardCard | GiftCard | CoinsCard)[]>(
      "/loyalty/cards",
    );
  },

  activateCard: async (
    data: ActivateCardRequest,
  ): Promise<{
    success: boolean;
    message: string;
    card?: RewardCard | GiftCard | CoinsCard;
  }> => {
    return apiClient.post<{
      success: boolean;
      message: string;
      card?: RewardCard | GiftCard | CoinsCard;
    }>("/loyalty/cards/activate", data);
  },

  discoverCard: async (
    code: string,
  ): Promise<{
    success: boolean;
    message: string;
    card?: RewardCard | GiftCard | CoinsCard;
  }> => {
    return apiClient.get<{
      success: boolean;
      message: string;
      card?: RewardCard | GiftCard | CoinsCard;
    }>(`/loyalty/cards/discover/${code}`);
  },

  addCardToAccount: async (
    cardId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/loyalty/cards/${cardId}/add`,
      {},
    );
  },

  // Stamps management
  activateStamp: async (
    data: ActivateStampRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      "/loyalty/stamps/activate",
      data,
    );
  },

  // Rewards management
  useReward: async (
    cardId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/loyalty/rewards/${cardId}/use`,
      {},
    );
  },

  // Gift cards management
  useGiftCard: async (
    cardId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/loyalty/gift-cards/${cardId}/use`,
      {},
    );
  },

  // Coins management
  getCoinsBalance: async (): Promise<{ balance: number }> => {
    return apiClient.get<{ balance: number }>("/loyalty/coins/balance");
  },

  getCoinsHistory: async (): Promise<
    {
      id: string;
      amount: number;
      type: "earned" | "spent" | "received" | "sent";
      description: string;
      createdAt: string;
    }[]
  > => {
    return apiClient.get<
      {
        id: string;
        amount: number;
        type: "earned" | "spent" | "received" | "sent";
        description: string;
        createdAt: string;
      }[]
    >("/loyalty/coins/history");
  },
};

export default loyaltyApi;
