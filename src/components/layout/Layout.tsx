import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MobileNavBar from "./MobileNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Load user data and wallet balance
    const loadUserData = async () => {
      try {
        if (import.meta.env.VITE_TEMPO !== "true") {
          // In a real environment, fetch from API
          // const userProfile = await userApi.getProfile();
          // const walletBalance = await walletService.getBalance();
          // Update user data in state or context
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [navigate]);

  // Determine active item based on current path
  const getActiveItem = () => {
    if (currentPath === "/") return "home";
    if (currentPath.startsWith("/store")) return "store";
    if (currentPath.startsWith("/loyalty")) return "loyalty";
    if (currentPath.startsWith("/cart")) return "cart";
    if (currentPath.startsWith("/wallet")) return "wallet";
    return "home";
  };

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        coinsBalance={1250}
        userName="محمد"
        cartItemsCount={3}
        onNavigate={handleNavigate}
      />

      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 mt-[70px]">
        {children}
      </main>

      <MobileNavBar
        activeItem={
          getActiveItem() as "home" | "store" | "loyalty" | "cart" | "wallet"
        }
        cartItemsCount={3}
        coinsBalance={1250}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Layout;
