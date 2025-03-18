import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized errors (token expired)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Helper methods for common HTTP methods
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: "GET", url, params });
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "POST", url, data });
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: "PUT", url, data });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: "DELETE", url });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
