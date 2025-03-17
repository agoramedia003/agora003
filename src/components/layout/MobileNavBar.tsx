import React from "react";
import {
  Home,
  ShoppingBag,
  Gift,
  Wallet,
  ShoppingCart,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavBarProps {
  activeItem?: "home" | "store" | "loyalty" | "cart" | "wallet";
  cartItemsCount?: number;
  coinsBalance?: number;
  onNavigate?: (route: string) => void;
}

const MobileNavBar = ({
  activeItem = "home",
  cartItemsCount = 0,
  coinsBalance = 0,
  onNavigate = () => {},
}: MobileNavBarProps) => {
  const navItems = [
    {
      name: "الرئيسية",
      icon: Home,
      path: "/",
      id: "home",
    },
    {
      name: "المتجر",
      icon: ShoppingBag,
      path: "/store",
      id: "store",
    },
    {
      name: "العروض",
      icon: Gift,
      path: "/promotions",
      id: "promotions",
    },
    {
      name: "السلة",
      icon: ShoppingCart,
      path: "/cart",
      id: "cart",
      badge: cartItemsCount > 0 ? cartItemsCount : null,
    },
    {
      name: "المحفظة",
      icon: Wallet,
      path: "/wallet",
      id: "wallet",
      badge: coinsBalance > 0 ? coinsBalance : null,
      badgeClass: "text-amber-500",
      badgeIcon: Coins,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full cursor-pointer relative",
              activeItem === item.id
                ? "text-primary"
                : "text-gray-500 hover:text-primary",
            )}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge && !item.badgeIcon && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            {item.badgeIcon && item.badge && (
              <div
                className={cn(
                  "flex items-center text-xs mt-1",
                  item.badgeClass || "",
                )}
              >
                <item.badgeIcon className="w-3 h-3 mr-1" />
                <span>{item.badge}</span>
              </div>
            )}
            {!item.badgeIcon && (
              <span className="text-xs mt-1">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNavBar;
