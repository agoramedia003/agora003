import apiClient from "./apiClient";
import { User, UserProfile } from "../../types/user";

export interface LoginRequest {
  phone: string;
  pin: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email?: string;
  pin: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ChangePasswordRequest {
  currentPin: string;
  newPin: string;
}

const AuthService = {
  /**
   * Login with phone number and PIN
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("isLoggedIn", "true");
    }

    return response;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/register",
      data,
    );

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("isLoggedIn", "true");
    }

    return response;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>("/users/profile");
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.put<UserProfile>("/users/profile", data);
  },

  /**
   * Change user password (PIN)
   */
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.put<{ success: boolean; message: string }>(
      "/users/password",
      data,
    );
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem("isLoggedIn") === "true";
  },
};

export default AuthService;
