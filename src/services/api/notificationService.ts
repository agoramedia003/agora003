import apiClient from "./apiClient";
import { Notification } from "../../types/notification";

export interface NotificationFilters {
  read?: boolean;
  limit?: number;
  offset?: number;
}

export interface UpdateNotificationRequest {
  read: boolean;
}

export interface RegisterTokenRequest {
  token: string;
  platform: "android" | "ios" | "web";
}

const NotificationService = {
  /**
   * Get all notifications with optional filters
   */
  getNotifications: async (
    filters?: NotificationFilters,
  ): Promise<Notification[]> => {
    return apiClient.get<Notification[]>("/notifications", filters);
  },

  /**
   * Update notification status (read/unread)
   */
  updateNotification: async (
    id: string,
    data: UpdateNotificationRequest,
  ): Promise<Notification> => {
    return apiClient.put<Notification>(`/notifications/${id}`, data);
  },

  /**
   * Register device token for push notifications
   */
  registerToken: async (
    data: RegisterTokenRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(
      "/notifications/token",
      data,
    );
  },
};

export default NotificationService;
