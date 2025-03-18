import apiClient from "./apiClient";
import { Order, OrderStatus } from "../../types/order";

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryTime: "asap" | "scheduled";
  scheduledTime?: string;
}

export interface CreateOrderRequest {
  deliveryInfo: DeliveryInfo;
  paymentMethod: "cash" | "coins";
  loyaltyCardId?: string;
  loyaltyAction?: "redeem" | "collect" | "request";
}

export interface OrderFilters {
  status?:
    | "pending"
    | "accepted"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  limit?: number;
  offset?: number;
}

const OrderService = {
  /**
   * Create a new order
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    return apiClient.post<Order>("/orders", data);
  },

  /**
   * Get all orders with optional filters
   */
  getOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    return apiClient.get<Order[]>("/orders", filters);
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  /**
   * Track order status
   */
  trackOrder: async (id: string): Promise<OrderStatus> => {
    return apiClient.get<OrderStatus>(`/orders/${id}/track`);
  },

  /**
   * Reorder a previous order (adds all items to cart)
   */
  reorder: async (orderId: string): Promise<any> => {
    return apiClient.post<any>(`/orders/${orderId}/reorder`);
  },
};

export default OrderService;
