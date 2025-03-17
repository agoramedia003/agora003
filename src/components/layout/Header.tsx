import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Coins,
  ShoppingCart,
  User,
  ChevronDown,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  coinsBalance?: number;
  userName?: string;
  userAvatar?: string;
  cartItemsCount?: number;
  onNavigate?: (route: string) => void;
}

const Header = ({
  coinsBalance = 1250,
  userName = "محمد",
  userAvatar = "",
  cartItemsCount = 0,
  onNavigate = () => {},
}: HeaderProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-white shadow-sm z-50 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Add Card Button - Visible on all devices */}
        <div>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onNavigate("/cards")}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="text-xs">إضافة بطاقة</span>
          </Button>
        </div>

        {/* Logo */}
        <div
          onClick={() => onNavigate("/")}
          className="flex items-center cursor-pointer"
        >
          <div className="font-bold text-xl text-primary">وجباتي</div>
        </div>

        {/* Navigation Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          <NavLink
            href="/store"
            label="المتجر"
            active={currentPath.startsWith("/store")}
            onClick={() => onNavigate("/store")}
          />
          <NavLink
            href="/loyalty"
            label="برنامج الولاء"
            active={currentPath.startsWith("/loyalty")}
            onClick={() => onNavigate("/loyalty")}
          />
          <NavLink
            href="/wallet"
            label="محفظة الكوينز"
            active={currentPath.startsWith("/wallet")}
            onClick={() => onNavigate("/wallet")}
          />
          <NavLink
            href="/orders"
            label="تتبع الطلبات"
            active={currentPath.startsWith("/orders")}
            onClick={() => onNavigate("/orders")}
          />
          <NavLink
            href="/about"
            label="من نحن"
            active={currentPath.startsWith("/about")}
            onClick={() => onNavigate("/about")}
          />
          <NavLink
            href="/cards"
            label="إضافة بطاقة"
            active={currentPath.startsWith("/cards")}
            onClick={() => onNavigate("/cards")}
          />
        </nav>

        {/* Right Side - Cart, Coins Balance & Profile */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Cart Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => onNavigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>

          {/* Coins Balance - Hidden on Mobile */}
          <div className="hidden md:block">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-amber-500"
                    onClick={() => onNavigate("/wallet")}
                  >
                    <Coins className="h-5 w-5" />
                    <span className="font-medium">{coinsBalance}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>رصيد الكوينز الخاص بك</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer flex items-center gap-1">
                <Avatar>
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-white">
                      {userName.substring(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onNavigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("/wallet")}>
                <Coins className="mr-2 h-4 w-4" />
                <span>رصيد الكوينز</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("/orders")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>تتبع الطلبات</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("/orders")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>طلباتي</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("/promotions")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>العروض</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("/about")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>من نحن</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, label, active = false, onClick }: NavLinkProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
        active ? "text-primary" : "text-gray-600",
      )}
    >
      {label}
    </div>
  );
};

export default Header;
