import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/api/adminApi";

interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: "admin" | "manager" | "staff";
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const loadAdmin = useCallback(async () => {
    setIsLoading(true);
    try {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      if (!isLoggedIn) {
        setIsAuthenticated(false);
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      // Try to get admin from localStorage first
      const adminJson = localStorage.getItem("admin");
      if (adminJson) {
        setAdmin(JSON.parse(adminJson));
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error loading admin:", error);
      setIsAuthenticated(false);
      setAdmin(null);
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("admin");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (import.meta.env.VITE_TEMPO === "true") {
        // Mock login for Tempo environment
        const mockAdmin = {
          id: "1",
          name: "Admin",
          username,
          role: "admin" as const,
        };
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("admin", JSON.stringify(mockAdmin));
        setAdmin(mockAdmin);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Real API call
        const response = await adminApi.login({ username, password });
        const adminData = {
          id: response.id,
          name: response.name,
          username,
          role: response.role,
        };
        localStorage.setItem("admin", JSON.stringify(adminData));
        setAdmin(adminData);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("admin");
    setAdmin(null);
    setIsAuthenticated(false);
    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  return {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    loadAdmin,
  };
};
