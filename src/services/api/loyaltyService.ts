import apiClient from "./apiClient";
import { LoyaltyCard, RewardCard, GiftCard } from "../../types/loyalty";

export interface ActivateCardRequest {
  code: string;
}

export interface AddStampRequest {
  cardId: string;
  code: string;
}

export interface RedeemRewardRequest {
  cardId: string;
  stageIndex: number;
}

const LoyaltyService = {
  /**
   * Get all reward cards
   */
  getRewardCards: async (): Promise<RewardCard[]> => {
    return apiClient.get<RewardCard[]>("/loyalty/reward-cards");
  },

  /**
   * Get all gift cards
   */
  getGiftCards: async (): Promise<GiftCard[]> => {
    return apiClient.get<GiftCard[]>("/loyalty/gift-cards");
  },

  /**
   * Activate a new card
   */
  activateCard: async (data: ActivateCardRequest): Promise<LoyaltyCard> => {
    return apiClient.post<LoyaltyCard>("/loyalty/activate", data);
  },

  /**
   * Add a stamp to a reward card
   */
  addStamp: async (data: AddStampRequest): Promise<RewardCard> => {
    return apiClient.post<RewardCard>("/loyalty/stamps", data);
  },

  /**
   * Redeem a reward
   */
  redeemReward: async (
    data: RedeemRewardRequest,
  ): Promise<{ success: boolean; reward: any; updatedCard: RewardCard }> => {
    return apiClient.post<{
      success: boolean;
      reward: any;
      updatedCard: RewardCard;
    }>("/loyalty/redeem", data);
  },

  /**
   * Update card colors
   */
  updateCardColors: async (
    cardId: string,
    colors: { backgroundColor: string; textColor: string },
  ): Promise<LoyaltyCard> => {
    return apiClient.put<LoyaltyCard>(
      `/loyalty/cards/${cardId}/colors`,
      colors,
    );
  },
};

export default LoyaltyService;
