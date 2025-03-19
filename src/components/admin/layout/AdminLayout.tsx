import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      title: "لوحة التحكم",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "إدارة الطلبات",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/admin/orders",
    },
    {
      title: "إدارة المتجر",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/store",
    },
    {
      title: "إدارة المستخدمين",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "إدارة البطاقات",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/admin/cards",
    },
    {
      title: "إدارة التحويلات",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/admin/transactions",
    },
    {
      title: "التقييم الداخلي",
      icon: <BarChart2 className="h-5 w-5" />,
      path: "/admin/analytics",
    },
    {
      title: "الإعدادات",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-bold text-lg">القائمة</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="space-y-1 px-2">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.icon}
                          <span className="mr-2">{item.title}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="mr-2">تسجيل الخروج</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">لوحة تحكم المسؤول</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm">
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <span className="mr-2">{item.title}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
