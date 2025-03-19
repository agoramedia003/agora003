import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ShoppingBag,
  Clock,
  Truck,
  Check,
  DollarSign,
  Coins,
  BarChart2,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Mock data for statistics
  const stats = {
    newOrders: 12,
    processingOrders: 8,
    deliveringOrders: 5,
    dailySales: 2450,
    coinsUsed: 1200,
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="طلبات جديدة"
            value={stats.newOrders}
            icon={<ShoppingBag className="h-8 w-8 text-blue-500" />}
            bgColor="bg-blue-50"
            textColor="text-blue-700"
          />
          <StatCard
            title="قيد المعالجة"
            value={stats.processingOrders}
            icon={<Clock className="h-8 w-8 text-amber-500" />}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
          <StatCard
            title="قيد التوصيل"
            value={stats.deliveringOrders}
            icon={<Truck className="h-8 w-8 text-purple-500" />}
            bgColor="bg-purple-50"
            textColor="text-purple-700"
          />
          <StatCard
            title="المبيعات اليومية"
            value={`${stats.dailySales} د.م`}
            icon={<DollarSign className="h-8 w-8 text-green-500" />}
            bgColor="bg-green-50"
            textColor="text-green-700"
          />
          <StatCard
            title="الكوينز المستخدمة"
            value={stats.coinsUsed}
            icon={<Coins className="h-8 w-8 text-amber-500" />}
            bgColor="bg-amber-50"
            textColor="text-amber-700"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                حالة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">الرسم البياني لحالة الطلبات</p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                المبيعات اليومية والأسبوعية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">الرسم البياني للمبيعات</p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management Tabs */}
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              الطلبات الجديدة
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              قيد المعالجة
            </TabsTrigger>
            <TabsTrigger value="delivering" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              قيد التوصيل
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              تم التسليم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات الجديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  لا توجد طلبات جديدة حاليًا
                </div>
                {/* In a real app, you would map through new orders and display them */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات قيد المعالجة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  لا توجد طلبات قيد المعالجة حاليًا
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivering">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات قيد التوصيل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  لا توجد طلبات قيد التوصيل حاليًا
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivered">
            <Card>
              <CardHeader>
                <CardTitle>الطلبات المسلمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  لا توجد طلبات مسلمة حاليًا
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: StatCardProps) => {
  return (
    <Card className={`${bgColor} border-none shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
          </div>
          <div className="p-3 rounded-full bg-white/80 shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
