import apiClient from "./apiClient";
import { LoyaltyCard, RewardCard, GiftCard } from "../../types/loyalty";

export interface CreateRewardCardRequest {
  title: string;
  description: string;
  stages: {
    required: number;
    reward: string;
    rewardType: "discount" | "gift";
    discountValue?: number;
  }[];
  backgroundColor: string;
  textColor: string;
  expiryDate: string;
  count: number;
}

export interface CreateGiftCardRequest {
  title: string;
  giftType: "discount" | "gift";
  discountValue?: number;
  expiryDate: string;
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
  count: number;
}

export interface CreateCoinsCardRequest {
  title: string;
  coinsAmount: number;
  count: number;
}

export interface CardStamp {
  id: string;
  cardId: string;
  code: string;
  isActive: boolean;
  activatedBy?: string;
  activatedAt?: string;
}

export interface AdminCardResponse {
  id: string;
  code: string;
  type: "reward" | "gift" | "coins";
  title: string;
  description?: string;
  backgroundColor: string;
  textColor: string;
  expiryDate?: string;
  isActive: boolean;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  coinsAmount?: number;
  giftType?: "discount" | "gift";
  discountValue?: number;
  imageUrl?: string;
  stamps?: CardStamp[];
  stages?: {
    required: number;
    reward: string;
    rewardType: "discount" | "gift";
    discountValue?: number;
  }[];
}

const CardService = {
  /**
   * Get all cards (admin only)
   */
  getAllCards: async (): Promise<AdminCardResponse[]> => {
    return apiClient.get<AdminCardResponse[]>("/admin/cards");
  },

  /**
   * Create reward cards
   */
  createRewardCards: async (
    data: CreateRewardCardRequest,
  ): Promise<AdminCardResponse[]> => {
    return apiClient.post<AdminCardResponse[]>("/admin/cards/reward", data);
  },

  /**
   * Create gift cards
   */
  createGiftCards: async (
    data: CreateGiftCardRequest,
  ): Promise<AdminCardResponse[]> => {
    return apiClient.post<AdminCardResponse[]>("/admin/cards/gift", data);
  },

  /**
   * Create coins cards
   */
  createCoinsCards: async (
    data: CreateCoinsCardRequest,
  ): Promise<AdminCardResponse[]> => {
    return apiClient.post<AdminCardResponse[]>("/admin/cards/coins", data);
  },

  /**
   * Delete card
   */
  deleteCard: async (cardId: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/admin/cards/${cardId}`);
  },

  /**
   * Update card
   */
  updateCard: async (cardId: string, data: any): Promise<AdminCardResponse> => {
    return apiClient.put<AdminCardResponse>(`/admin/cards/${cardId}`, data);
  },

  /**
   * Deactivate card
   */
  deactivateCard: async (cardId: string): Promise<{ success: boolean }> => {
    return apiClient.put<{ success: boolean }>(
      `/admin/cards/${cardId}/deactivate`,
      {},
    );
  },

  /**
   * Generate stamp activation code
   */
  generateStampCode: async (stampId: string): Promise<{ code: string }> => {
    return apiClient.post<{ code: string }>(
      `/admin/stamps/${stampId}/generate-code`,
      {},
    );
  },

  /**
   * Upload card image
   */
  uploadCardImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post<{ url: string }>(
      "/admin/upload/card-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};

export default CardService;
