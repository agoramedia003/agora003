import apiClient from "./apiClient";

export interface UserLoginRequest {
  phone: string;
  pin: string;
}

export interface UserRegisterRequest {
  name: string;
  phone: string;
  pin: string;
}

export interface UserResponse {
  id: string;
  name: string;
  phone: string;
  email?: string;
  coinsBalance: number;
  createdAt: string;
  token?: string;
}

const userApi = {
  login: async (data: UserLoginRequest): Promise<UserResponse> => {
    // In a real implementation, this would call the API
    // For now, we'll mock the response
    return apiClient.post<UserResponse>("/auth/login", data);
  },

  register: async (data: UserRegisterRequest): Promise<UserResponse> => {
    return apiClient.post<UserResponse>("/auth/register", data);
  },

  getProfile: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>("/user/profile");
  },

  updateProfile: async (
    data: Partial<UserRegisterRequest>,
  ): Promise<UserResponse> => {
    return apiClient.put<UserResponse>("/user/profile", data);
  },

  getCoinsBalance: async (): Promise<{ balance: number }> => {
    return apiClient.get<{ balance: number }>("/user/coins");
  },

  transferCoins: async (data: {
    recipientPhone: string;
    amount: number;
  }): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      "/user/coins/transfer",
      data,
    );
  },

  getTransactionHistory: async (): Promise<any[]> => {
    return apiClient.get<any[]>("/user/transactions");
  },
};

export default userApi;
