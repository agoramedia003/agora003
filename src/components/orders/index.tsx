import React from "react";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Check, ChefHat, Truck, Clock, X } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

const OrdersPage = () => {
  const orders: Order[] = [
    {
      id: "ORD-1234",
      date: "2023-06-30T14:30:00",
      status: "delivered",
      items: [
        { name: "برجر دجاج مقرمش", quantity: 2, price: 35 },
        { name: "بطاطس كبير", quantity: 1, price: 15 },
        { name: "كولا", quantity: 2, price: 8 },
      ],
      total: 101,
    },
    {
      id: "ORD-1235",
      date: "2023-07-01T12:15:00",
      status: "preparing",
      items: [
        { name: "بيتزا خضار", quantity: 1, price: 45 },
        { name: "سلطة", quantity: 1, price: 20 },
      ],
      total: 65,
    },
    {
      id: "ORD-1236",
      date: "2023-07-01T13:45:00",
      status: "accepted",
      items: [
        { name: "شاورما لحم", quantity: 2, price: 38 },
        { name: "عصير برتقال", quantity: 2, price: 15 },
      ],
      total: 106,
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">تتبع الطلبات</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "قيد الانتظار",
          icon: Clock,
          color: "text-amber-500",
          bgColor: "bg-amber-100",
          step: 0,
        };
      case "accepted":
        return {
          label: "تم قبول الطلب",
          icon: Check,
          color: "text-green-500",
          bgColor: "bg-green-100",
          step: 1,
        };
      case "preparing":
        return {
          label: "جاري التحضير",
          icon: ChefHat,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          step: 2,
        };
      case "delivering":
        return {
          label: "جاري التوصيل",
          icon: Truck,
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          step: 3,
        };
      case "delivered":
        return {
          label: "تم التوصيل",
          icon: Check,
          color: "text-green-500",
          bgColor: "bg-green-100",
          step: 4,
        };
      case "cancelled":
        return {
          label: "تم إلغاء الطلب",
          icon: X,
          color: "text-red-500",
          bgColor: "bg-red-100",
          step: -1,
        };
      default:
        return {
          label: "غير معروف",
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          step: 0,
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const steps = [
    { label: "قبول الطلب", icon: Check },
    { label: "التحضير", icon: ChefHat },
    { label: "التوصيل", icon: Truck },
    { label: "تم التوصيل", icon: Check },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.id}</CardTitle>
            <CardDescription>{formatDate(order.date)}</CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color} text-sm font-medium flex items-center`}
          >
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusInfo.label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-medium mb-2">الطلبات</h4>
          <ul className="space-y-1">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{item.price * item.quantity} د.م</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
            <span>الإجمالي</span>
            <span>{order.total} د.م</span>
          </div>
        </div>

        {order.status !== "cancelled" && (
          <div className="mt-6">
            <h4 className="font-medium mb-4">حالة الطلب</h4>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${statusInfo.step > 0 ? Math.min(100, (statusInfo.step / (steps.length - 1)) * 100) : 0}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="flex justify-between relative z-10">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = statusInfo.step >= index + 1;
                  const isCurrent = statusInfo.step === index + 1;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-white" : isCurrent ? "bg-primary-light text-primary border-2 border-primary" : "bg-gray-200 text-gray-500"}`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-2 text-center">
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => {
              // Show order details dialog
              const dialog = document.createElement("dialog");
              dialog.className =
                "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50";
              dialog.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto">
                  <h3 class="text-lg font-medium mb-4">تفاصيل الطلب ${order.id}</h3>
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-gray-500">تاريخ الطلب</p>
                      <p>${new Date(order.date).toLocaleDateString("ar-SA")}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">حالة الطلب</p>
                      <p>${getStatusInfo(order.status).label}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">المنتجات</p>
                      <ul class="space-y-2 mt-2">
                        ${order.items
                          .map(
                            (item) => `
                          <li class="flex justify-between">
                            <span>${item.name} x${item.quantity}</span>
                            <span>${item.price * item.quantity} د.م</span>
                          </li>
                        `,
                          )
                          .join("")}
                      </ul>
                    </div>
                    <div class="pt-2 border-t">
                      <div class="flex justify-between font-bold">
                        <span>الإجمالي</span>
                        <span>${order.total} د.م</span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-end">
                    <button id="closeBtn" class="px-4 py-2 bg-gray-200 rounded-md">إغلاق</button>
                  </div>
                </div>
              `;
              document.body.appendChild(dialog);
              dialog.showModal();

              document
                .getElementById("closeBtn")
                ?.addEventListener("click", () => {
                  dialog.close();
                  document.body.removeChild(dialog);
                });
            }}
          >
            تفاصيل الطلب
          </Button>
          {order.status === "delivered" && (
            <Button
              onClick={() => {
                // Reorder logic - redirect to cart with these items
                console.log("Reordering items:", order.items);
                window.location.href = "/cart";
              }}
            >
              طلب مرة أخرى
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
