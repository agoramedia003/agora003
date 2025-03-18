import apiClient from "./apiClient";
import { Cart, CartItem } from "../../types/cart";

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  extras?: string[];
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyLoyaltyCardRequest {
  cardId: string;
  action: "redeem" | "collect" | "request";
}

const CartService = {
  /**
   * Get current cart contents
   */
  getCart: async (): Promise<Cart> => {
    return apiClient.get<Cart>("/cart");
  },

  /**
   * Add a product to the cart
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    return apiClient.post<Cart>("/cart", data);
  },

  /**
   * Update quantity of a cart item
   */
  updateQuantity: async (
    itemId: string,
    data: UpdateCartItemRequest,
  ): Promise<Cart> => {
    return apiClient.put<Cart>(`/cart/${itemId}`, data);
  },

  /**
   * Remove an item from the cart
   */
  removeFromCart: async (itemId: string): Promise<Cart> => {
    return apiClient.delete<Cart>(`/cart/${itemId}`);
  },

  /**
   * Clear the cart
   */
  clearCart: async (): Promise<Cart> => {
    return apiClient.delete<Cart>("/cart");
  },

  /**
   * Apply a loyalty card to the cart
   */
  applyLoyaltyCard: async (data: ApplyLoyaltyCardRequest): Promise<Cart> => {
    return apiClient.post<Cart>("/cart/apply-loyalty", data);
  },

  /**
   * Apply a promotion to the cart
   */
  applyPromotion: async (promotionId: string): Promise<Cart> => {
    return apiClient.post<Cart>("/promotions/apply", { promotionId });
  },
};

export default CartService;
