import apiClient from "./apiClient";
import { Promotion, FlashDeal } from "../../types/promotion";

export interface PromotionFilters {
  category?: string;
}

const PromotionService = {
  /**
   * Get all promotions with optional filters
   */
  getPromotions: async (filters?: PromotionFilters): Promise<Promotion[]> => {
    return apiClient.get<Promotion[]>("/promotions", filters);
  },

  /**
   * Get a specific promotion by ID
   */
  getPromotionById: async (id: string): Promise<Promotion> => {
    return apiClient.get<Promotion>(`/promotions/${id}`);
  },

  /**
   * Get flash deals (limited time offers)
   */
  getFlashDeals: async (): Promise<FlashDeal[]> => {
    return apiClient.get<FlashDeal[]>("/promotions/flash-deals");
  },

  /**
   * Apply a promotion to the cart
   */
  applyPromotion: async (promotionId: string): Promise<any> => {
    return apiClient.post<any>("/promotions/apply", { promotionId });
  },
};

export default PromotionService;
