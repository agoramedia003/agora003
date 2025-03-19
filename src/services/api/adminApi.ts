import apiClient from "./apiClient";

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminResponse {
  id: string;
  name: string;
  username: string;
  role: "admin" | "manager" | "staff";
  token: string;
}

export interface OrderUpdateRequest {
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
}

export interface CreateCardRequest {
  type: "reward" | "gift" | "coins";
  title: string;
  description?: string;
  count: number;
  expiryDate: string;
  backgroundColor: string;
  textColor: string;
  // For reward cards
  stages?: {
    required: number;
    reward: string;
    rewardType: "gift" | "discount";
    discountValue?: number;
  }[];
  // For gift cards
  giftType?: "gift" | "discount";
  discountValue?: number;
  imageUrl?: string;
  // For coins cards
  coinsAmount?: number;
}

const adminApi = {
  // Authentication
  login: async (data: AdminLoginRequest): Promise<AdminResponse> => {
    return apiClient.post<AdminResponse>("/admin/auth/login", data);
  },

  // Orders management
  getOrders: async (status?: string): Promise<any[]> => {
    const params = status ? { status } : {};
    return apiClient.get<any[]>("/admin/orders", params);
  },

  getOrderById: async (id: string): Promise<any> => {
    return apiClient.get<any>(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (
    id: string,
    data: OrderUpdateRequest,
  ): Promise<any> => {
    return apiClient.put<any>(`/admin/orders/${id}/status`, data);
  },

  // Products management
  getProducts: async (): Promise<any[]> => {
    return apiClient.get<any[]>("/admin/products");
  },

  createProduct: async (data: FormData): Promise<any> => {
    return apiClient.post<any>("/admin/products", data);
  },

  updateProduct: async (id: string, data: FormData): Promise<any> => {
    return apiClient.put<any>(`/admin/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/admin/products/${id}`);
  },

  // Categories management
  getCategories: async (): Promise<any[]> => {
    return apiClient.get<any[]>("/admin/categories");
  },

  createCategory: async (data: FormData): Promise<any> => {
    return apiClient.post<any>("/admin/categories", data);
  },

  updateCategory: async (id: string, data: FormData): Promise<any> => {
    return apiClient.put<any>(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/admin/categories/${id}`);
  },

  // Cards management
  getCards: async (type?: "reward" | "gift" | "coins"): Promise<any[]> => {
    const params = type ? { type } : {};
    return apiClient.get<any[]>("/admin/cards", params);
  },

  createCards: async (data: CreateCardRequest): Promise<any> => {
    return apiClient.post<any>("/admin/cards", data);
  },

  uploadCardImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post<{ url: string }>(
      "/admin/upload/card-image",
      formData,
    );
  },

  deactivateCard: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.put<{ success: boolean }>(
      `/admin/cards/${id}/deactivate`,
      {},
    );
  },

  deleteCard: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/admin/cards/${id}`);
  },

  // Dashboard statistics
  getDashboardStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    recentOrders: any[];
    popularProducts: any[];
    ordersByStatus: { status: string; count: number }[];
  }> => {
    return apiClient.get<{
      totalOrders: number;
      totalRevenue: number;
      totalCustomers: number;
      recentOrders: any[];
      popularProducts: any[];
      ordersByStatus: { status: string; count: number }[];
    }>("/admin/dashboard/stats");
  },
};

export default adminApi;
