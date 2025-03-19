import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../services/api/userApi";
import { UserProfile } from "../types/user";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try to get user from localStorage first
      const userJson = localStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // If not in localStorage and not in Tempo environment, fetch from API
      if (import.meta.env.VITE_TEMPO !== "true") {
        const userProfile = await userApi.getProfile();
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (phone: string, pin: string) => {
    setIsLoading(true);
    try {
      if (import.meta.env.VITE_TEMPO === "true") {
        // Mock login for Tempo environment
        const mockUser = {
          id: "1",
          name: "مستخدم",
          phone,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser as UserProfile);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Real API call
        const response = await userApi.login({ phone, pin });
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    loadUser,
  };
};
