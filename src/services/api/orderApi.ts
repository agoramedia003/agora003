import apiClient from "./apiClient";

export interface OrderItem {
  productId: string;
  quantity: number;
  options?: { optionId: string; value: string }[];
}

export interface CreateOrderRequest {
  items: OrderItem[];
  address: string;
  paymentMethod: "cash" | "card" | "wallet";
  useCoins?: boolean;
  cardCodes?: string[];
  notes?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    options?: { name: string; value: string }[];
  }[];
  total: number;
  coinsUsed?: number;
  coinsEarned?: number;
  address: string;
  paymentMethod: "cash" | "card" | "wallet";
  createdAt: string;
  estimatedDeliveryTime?: string;
}

const orderApi = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    return apiClient.post<OrderResponse>("/orders", data);
  },

  getOrders: async (): Promise<OrderResponse[]> => {
    return apiClient.get<OrderResponse[]>("/orders");
  },

  getOrderById: async (id: string): Promise<OrderResponse> => {
    return apiClient.get<OrderResponse>(`/orders/${id}`);
  },

  cancelOrder: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/orders/${id}/cancel`,
      {},
    );
  },

  trackOrder: async (
    id: string,
  ): Promise<{
    status: OrderResponse["status"];
    currentStep: number;
    steps: { title: string; completed: boolean; time?: string }[];
  }> => {
    return apiClient.get<{
      status: OrderResponse["status"];
      currentStep: number;
      steps: { title: string; completed: boolean; time?: string }[];
    }>(`/orders/${id}/track`);
  },
};

export default orderApi;
