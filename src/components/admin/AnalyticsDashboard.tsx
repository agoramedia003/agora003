import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  BarChart2,
  TrendingUp,
  Clock,
  Star,
  Package,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Coins,
} from "lucide-react";

interface ProductRating {
  id: string;
  name: string;
  averageRating: number;
  totalRatings: number;
}

interface OrderTime {
  stage: string;
  averageTime: number; // in minutes
  status: "good" | "warning" | "bad";
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  day: string;
  time: string;
}

interface SalesData {
  date: string;
  sales: number;
  coins: number;
}

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [productRatings, setProductRatings] = useState<ProductRating[]>([]);
  const [orderTimes, setOrderTimes] = useState<OrderTime[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Filter states
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "weekly",
  );

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      // Mock product ratings data
      const mockProductRatings: ProductRating[] = [
        {
          id: "1",
          name: "برجر دجاج مقرمش",
          averageRating: 4.8,
          totalRatings: 125,
        },
        {
          id: "2",
          name: "بيتزا خضار",
          averageRating: 4.5,
          totalRatings: 98,
        },
        {
          id: "3",
          name: "شاورما لحم",
          averageRating: 4.9,
          totalRatings: 112,
        },
        {
          id: "4",
          name: "عصير برتقال طازج",
          averageRating: 4.7,
          totalRatings: 87,
        },
        {
          id: "5",
          name: "كيك الشوكولاتة",
          averageRating: 4.6,
          totalRatings: 76,
        },
      ];

      // Mock order times data
      const mockOrderTimes: OrderTime[] = [
        {
          stage: "قبول الطلب",
          averageTime: 2.5,
          status: "good",
        },
        {
          stage: "بدء الإعداد",
          averageTime: 5.8,
          status: "good",
        },
        {
          stage: "إبلاغ عامل التوصيل",
          averageTime: 3.2,
          status: "good",
        },
        {
          stage: "التوصيل",
          averageTime: 18.5,
          status: "warning",
        },
        {
          stage: "إجمالي الوقت",
          averageTime: 30.0,
          status: "good",
        },
      ];

      // Mock top products data
      const mockTopProducts: TopProduct[] = [
        {
          id: "1",
          name: "برجر دجاج مقرمش",
          sales: 45,
          revenue: 1575,
          day: "الجمعة",
          time: "18:00 - 20:00",
        },
        {
          id: "2",
          name: "بيتزا خضار",
          sales: 38,
          revenue: 1710,
          day: "السبت",
          time: "19:00 - 21:00",
        },
        {
          id: "3",
          name: "شاورما لحم",
          sales: 32,
          revenue: 1216,
          day: "الخميس",
          time: "20:00 - 22:00",
        },
      ];

      // Mock sales data
      const mockSalesData: SalesData[] = [
        { date: "السبت", sales: 1200, coins: 600 },
        { date: "الأحد", sales: 1800, coins: 900 },
        { date: "الإثنين", sales: 1400, coins: 700 },
        { date: "الثلاثاء", sales: 2000, coins: 1000 },
        { date: "الأربعاء", sales: 1600, coins: 800 },
        { date: "الخميس", sales: 2200, coins: 1100 },
        { date: "الجمعة", sales: 2450, coins: 1200 },
      ];

      setProductRatings(mockProductRatings);
      setOrderTimes(mockOrderTimes);
      setTopProducts(mockTopProducts);
      setSalesData(mockSalesData);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const getStatusColor = (status: OrderTime["status"]) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "bad":
        return "text-red-600";
    }
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">التقييم الداخلي</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className={`px-4 py-2 ${timeRange === "daily" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("daily")}
              >
                يومي
              </button>
              <button
                className={`px-4 py-2 ${timeRange === "weekly" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("weekly")}
              >
                أسبوعي
              </button>
              <button
                className={`px-4 py-2 ${timeRange === "monthly" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("monthly")}
              >
                شهري
              </button>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Sales Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                تحليل المبيعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">الرسم البياني للمبيعات</p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                استخدام الكوينز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">الرسم البياني لاستخدام الكوينز</p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Ratings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              تقييمات المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">متوسط التقييم</TableHead>
                  <TableHead className="text-right">عدد التقييمات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productRatings.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < Math.floor(product.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span>{product.averageRating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.totalRatings}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Times */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              أوقات الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المرحلة</TableHead>
                  <TableHead className="text-right">
                    متوسط الوقت (دقائق)
                  </TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderTimes.map((time, index) => (
                  <TableRow key={index}>
                    <TableCell>{time.stage}</TableCell>
                    <TableCell>{time.averageTime.toFixed(1)}</TableCell>
                    <TableCell>
                      <span className={getStatusColor(time.status)}>
                        {time.status === "good" && "جيد"}
                        {time.status === "warning" && "متوسط"}
                        {time.status === "bad" && "سيء"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              المنتجات الأكثر مبيعًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-right">المبيعات</TableHead>
                  <TableHead className="text-right">الإيرادات (د.م)</TableHead>
                  <TableHead className="text-right">أفضل يوم</TableHead>
                  <TableHead className="text-right">أفضل وقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                    <TableCell>{product.day}</TableCell>
                    <TableCell>{product.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
