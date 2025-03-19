import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import {
  ShoppingBag,
  Clock,
  Truck,
  Check,
  X,
  Phone,
  MapPin,
  User,
  CreditCard,
  Bell,
  ChefHat,
  AlertCircle,
  Gift,
  Award,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  extras?: { name: string; price: number }[];
  cardCode?: string;
  cardType?: "gift" | "reward" | "coins";
  giftType?: "discount" | "gift";
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  coinsPrice?: number;
  status:
    | "new"
    | "processing"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  createdAt: string;
  timeInStage: number; // in seconds
}

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] =
    useState(false);
  const [deliveryAgent, setDeliveryAgent] = useState("");
  const [newDeliveryAgent, setNewDeliveryAgent] = useState("");
  const [newDeliveryPhone, setNewDeliveryPhone] = useState("");
  const [addingNewAgent, setAddingNewAgent] = useState(false);

  // Audio alert for new orders
  const [audioAlert] = useState(new Audio("/notification.mp3"));
  const [playingAlert, setPlayingAlert] = useState(false);
  const [notifyCustomerDialog, setNotifyCustomerDialog] = useState(false);
  const [notifyReason, setNotifyReason] = useState<"accept" | "reject">(
    "accept",
  );
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Load orders from API
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        if (import.meta.env.VITE_TEMPO !== "true") {
          // In a real environment, fetch from API
          const ordersData = await adminApi.getOrders();
          setOrders(ordersData);
        } else {
          // Mock orders data for Tempo environment
          setTimeout(() => {
            const mockOrders: Order[] = [
              {
                id: "ORD-1001",
                customerName: "أحمد محمد",
                customerPhone: "+212 612345678",
                customerAddress: "شارع الحسن الثاني، الدار البيضاء",
                items: [
                  {
                    name: "برجر دجاج مقرمش",
                    quantity: 2,
                    price: 35,
                    extras: [
                      { name: "جبنة إضافية", price: 5 },
                      { name: "صلصة حارة", price: 3 },
                    ],
                  },
                  {
                    name: "بطاطس كبير",
                    quantity: 1,
                    price: 15,
                  },
                  {
                    name: "بطاقة هدية",
                    quantity: 1,
                    price: 0,
                    cardCode: "GIFT-1234",
                    cardType: "gift",
                    giftType: "discount",
                  },
                ],
                total: 98,
                coinsPrice: 980,
                status: "new",
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
                timeInStage: 300, // 5 minutes
              },
              {
                id: "ORD-1002",
                customerName: "فاطمة العلوي",
                customerPhone: "+212 623456789",
                customerAddress: "شارع محمد الخامس، الرباط",
                items: [
                  {
                    name: "بيتزا خضار",
                    quantity: 1,
                    price: 45,
                  },
                  {
                    name: "كولا",
                    quantity: 2,
                    price: 8,
                  },
                  {
                    name: "بطاقة مكافآت",
                    quantity: 1,
                    price: 0,
                    cardCode: "REWARD-5678",
                    cardType: "reward",
                  },
                ],
                total: 61,
                status: "processing",
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
                timeInStage: 600, // 10 minutes
              },
              {
                id: "ORD-1003",
                customerName: "يوسف الناصري",
                customerPhone: "+212 634567890",
                customerAddress: "شارع المقاومة، مراكش",
                items: [
                  {
                    name: "شاورما لحم",
                    quantity: 2,
                    price: 38,
                  },
                  {
                    name: "عصير برتقال",
                    quantity: 2,
                    price: 15,
                  },
                ],
                total: 106,
                status: "preparing",
                createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
                timeInStage: 420, // 7 minutes
              },
              {
                id: "ORD-1004",
                customerName: "سارة بنعلي",
                customerPhone: "+212 645678901",
                customerAddress: "شارع الزرقطوني، الدار البيضاء",
                items: [
                  {
                    name: "برجر لحم أنجوس",
                    quantity: 1,
                    price: 48,
                    extras: [{ name: "بصل مقرمش", price: 4 }],
                  },
                  {
                    name: "سلطة",
                    quantity: 1,
                    price: 20,
                  },
                ],
                total: 72,
                status: "delivering",
                createdAt: new Date(Date.now() - 40 * 60000).toISOString(), // 40 minutes ago
                timeInStage: 900, // 15 minutes
              },
            ];

            setOrders(mockOrders);
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        setIsLoading(false);
      }
    };

    loadOrders();

    // Set up interval for time updates and alerts
    const intervalId = setInterval(() => {
      // Update time in stage for all orders
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          timeInStage: order.timeInStage + 1,
        })),
      );

      // Play audio alert for new orders every 10 seconds
      const hasNewOrders = orders.some((order) => order.status === "new");
      if (hasNewOrders && !playingAlert) {
        setPlayingAlert(true);
        audioAlert
          .play()
          .then(() => {
            setTimeout(() => setPlayingAlert(false), 3000);
          })
          .catch((error) => console.error("Audio playback failed:", error));
      }
    }, 1000);

    // Set up interval for audio alerts every 10 seconds
    const alertIntervalId = setInterval(() => {
      const hasNewOrders = orders.some((order) => order.status === "new");
      if (hasNewOrders && !playingAlert) {
        setPlayingAlert(true);
        audioAlert
          .play()
          .then(() => {
            setTimeout(() => setPlayingAlert(false), 3000);
          })
          .catch((error) => console.error("Audio playback failed:", error));
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(alertIntervalId);
    };
  }, [navigate, orders, audioAlert, playingAlert]);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, timeInStage: 0 }
          : order,
      ),
    );
  };

  const handleNotifyCustomer = (order: Order, reason: "accept" | "reject") => {
    setSelectedOrder(order);
    setNotifyReason(reason);
    setNotifyCustomerDialog(true);
  };

  const sendCustomerNotification = () => {
    if (!selectedOrder) return;

    if (notifyReason === "accept") {
      // In a real app, you would send a WhatsApp message to the customer
      alert(
        `تم إرسال رسالة واتساب إلى ${selectedOrder.customerPhone} لإبلاغه بقبول الطلب`,
      );
      // Update order status to preparing
      handleStatusChange(selectedOrder.id, "preparing");
    } else {
      // In a real app, you would send a WhatsApp message with the rejection reason
      alert(
        `تم إرسال رسالة واتساب إلى ${selectedOrder.customerPhone} لإبلاغه برفض الطلب: ${rejectReason}`,
      );
      // Update order status to cancelled
      handleStatusChange(selectedOrder.id, "cancelled");
    }

    // Close dialog
    setNotifyCustomerDialog(false);
    setRejectReason("");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getStatusColor = (status: Order["status"], timeInStage: number) => {
    // If time in stage is more than 5 minutes (300 seconds), show red
    if (timeInStage > 300) {
      return "bg-red-100 text-red-800 border-red-300";
    }

    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "preparing":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "delivering":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "جديد";
      case "processing":
        return "قيد المعالجة";
      case "preparing":
        return "قيد الإعداد";
      case "delivering":
        return "قيد التوصيل";
      case "delivered":
        return "تم التسليم";
      case "cancelled":
        return "ملغي";
      default:
        return "غير معروف";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return <ShoppingBag className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <ChefHat className="h-4 w-4" />;
      case "delivering":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Check className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCardTypeIcon = (cardType?: string) => {
    switch (cardType) {
      case "gift":
        return <Gift className="h-4 w-4 text-purple-500" />;
      case "reward":
        return <Award className="h-4 w-4 text-amber-500" />;
      case "coins":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleNotifyDelivery = (order: Order) => {
    setSelectedOrder(order);
    setShowDeliveryDialog(true);
  };

  const handleConfirmDelivery = (order: Order) => {
    setSelectedOrder(order);
    setShowDeliveryConfirmation(true);
  };

  const sendDeliveryNotification = () => {
    if (!selectedOrder) return;

    // Create WhatsApp URL with message for delivery agent
    const agentName = deliveryAgent || newDeliveryAgent;
    const agentPhone = deliveryAgent
      ? deliveryAgents.find((agent) => agent.name === deliveryAgent)?.phone
      : newDeliveryPhone;

    if (agentPhone) {
      const whatsappMessage = `مرحباً ${agentName}، لديك طلب جديد للتوصيل: ${selectedOrder.id}\nالعنوان: ${selectedOrder.customerAddress}\nالعميل: ${selectedOrder.customerName} - ${selectedOrder.customerPhone}`;
      const whatsappUrl = `https://wa.me/${agentPhone.replace(/\+|\s/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");
    }

    // Update order status
    handleStatusChange(selectedOrder.id, "delivering");

    // Close dialog
    setShowDeliveryDialog(false);
    setDeliveryAgent("");
    setNewDeliveryAgent("");
    setNewDeliveryPhone("");
    setAddingNewAgent(false);
  };

  const confirmOrderDelivery = () => {
    if (!selectedOrder) return;

    // Update order status
    handleStatusChange(selectedOrder.id, "delivered");

    // Close dialog
    setShowDeliveryConfirmation(false);
  };

  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const extrasTotal = item.extras
        ? item.extras.reduce(
            (sum, extra) => sum + extra.price * item.quantity,
            0,
          )
        : 0;
      return total + itemTotal + extrasTotal;
    }, 0);
  };

  // Delivery agents mock data
  const deliveryAgents = [
    { name: "محمد العربي", phone: "+212 612345678" },
    { name: "أحمد الفاسي", phone: "+212 623456789" },
    { name: "يوسف المراكشي", phone: "+212 634567890" },
  ];

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
        <h1 className="text-2xl font-bold mb-6">إدارة الطلبات</h1>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              الطلبات الجديدة
              <Badge variant="secondary" className="ml-2">
                {orders.filter((order) => order.status === "new").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              قيد المعالجة
              <Badge variant="secondary" className="ml-2">
                {orders.filter((order) => order.status === "processing").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              قيد الإعداد
              <Badge variant="secondary" className="ml-2">
                {orders.filter((order) => order.status === "preparing").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="delivering" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              قيد التوصيل
              <Badge variant="secondary" className="ml-2">
                {orders.filter((order) => order.status === "delivering").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* New Orders */}
          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                .filter((order) => order.status === "new")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader
                      className={`${getStatusColor(order.status, order.timeInStage)}`}
                    >
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.id}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(order.timeInStage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            {order.customerAddress}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <p className="font-medium mb-2">الطلبات:</p>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    {item.cardType &&
                                      getCardTypeIcon(item.cardType)}
                                    {item.quantity} x {item.name}
                                    {item.cardCode && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        ({item.cardCode})
                                      </span>
                                    )}
                                  </span>
                                  <span>{item.price * item.quantity} درهم</span>
                                </div>
                                {item.extras && item.extras.length > 0 && (
                                  <ul className="mt-1 space-y-1 pr-4 text-gray-500">
                                    {item.extras.map((extra, idx) => (
                                      <li
                                        key={idx}
                                        className="flex justify-between"
                                      >
                                        <span>+ {extra.name}</span>
                                        <span>
                                          {extra.price * item.quantity} درهم
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center font-bold">
                          <span>المجموع:</span>
                          <div className="flex flex-col items-end">
                            <span>{order.total} درهم</span>
                            {order.coinsPrice && (
                              <span className="text-sm text-gray-500">
                                ({order.coinsPrice} كوينز)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNotifyCustomer(order, "reject")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        رفض الطلب
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleNotifyCustomer(order, "accept")}
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          إبلاغ العميل
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(order.id, "preparing")
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          قبول الطلب
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Processing Orders */}
          <TabsContent value="processing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                .filter((order) => order.status === "processing")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader
                      className={`${getStatusColor(order.status, order.timeInStage)}`}
                    >
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.id}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(order.timeInStage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="font-medium mb-2">الطلبات:</p>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    {item.cardType &&
                                      getCardTypeIcon(item.cardType)}
                                    {item.quantity} x {item.name}
                                    {item.cardCode && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        ({item.cardCode})
                                      </span>
                                    )}
                                  </span>
                                  <span>{item.price * item.quantity} درهم</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center font-bold">
                          <span>المجموع:</span>
                          <span>{order.total} درهم</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(order.id, "preparing")
                        }
                      >
                        <ChefHat className="h-4 w-4 mr-1" />
                        بدء التحضير
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Preparing Orders */}
          <TabsContent value="preparing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                .filter((order) => order.status === "preparing")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader
                      className={`${getStatusColor(order.status, order.timeInStage)}`}
                    >
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.id}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(order.timeInStage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="font-medium mb-2">الطلبات:</p>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    {item.cardType &&
                                      getCardTypeIcon(item.cardType)}
                                    {item.quantity} x {item.name}
                                    {item.cardCode && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        ({item.cardCode})
                                      </span>
                                    )}
                                  </span>
                                  <span>{item.price * item.quantity} درهم</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(order.id, "delivering")
                          }
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          قيد التوصيل
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNotifyDelivery(order)}
                            >
                              <Bell className="h-4 w-4 mr-1" />
                              إشعار التوصيل
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Delivering Orders */}
          <TabsContent value="delivering">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                .filter((order) => order.status === "delivering")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader
                      className={`${getStatusColor(order.status, order.timeInStage)}`}
                    >
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.id}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {formatTime(order.timeInStage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-1 text-gray-500" />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            {order.customerAddress}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleConfirmDelivery(order)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            تأكيد التسليم
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delivery Notification Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إشعار عامل التوصيل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>اختر عامل التوصيل</Label>
              <RadioGroup
                value={deliveryAgent}
                onValueChange={setDeliveryAgent}
              >
                {deliveryAgents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <RadioGroupItem value={agent.name} id={agent.name} />
                    <Label htmlFor={agent.name} className="flex-1">
                      <div>{agent.name}</div>
                      <div className="text-sm text-gray-500">{agent.phone}</div>
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem
                    value="new"
                    id="new-agent"
                    onClick={() => setAddingNewAgent(true)}
                  />
                  <Label htmlFor="new-agent" className="flex-1">
                    إضافة عامل توصيل جديد
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {addingNewAgent && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">اسم عامل التوصيل</Label>
                  <Input
                    id="agent-name"
                    value={newDeliveryAgent}
                    onChange={(e) => setNewDeliveryAgent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agent-phone">رقم الهاتف</Label>
                  <Input
                    id="agent-phone"
                    value={newDeliveryPhone}
                    onChange={(e) => setNewDeliveryPhone(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeliveryDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={sendDeliveryNotification}
              disabled={
                !deliveryAgent &&
                !(newDeliveryAgent && newDeliveryPhone && addingNewAgent)
              }
            >
              إرسال إشعار
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Confirmation Dialog */}
      <Dialog
        open={showDeliveryConfirmation}
        onOpenChange={setShowDeliveryConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد تسليم الطلب</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              هل أنت متأكد من أنك تريد تأكيد تسليم الطلب {selectedOrder?.id}؟
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeliveryConfirmation(false)}
            >
              إلغاء
            </Button>
            <Button onClick={confirmOrderDelivery}>تأكيد التسليم</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Notification Dialog */}
      <Dialog
        open={notifyCustomerDialog}
        onOpenChange={setNotifyCustomerDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {notifyReason === "accept"
                ? "إبلاغ العميل بقبول الطلب"
                : "إبلاغ العميل برفض الطلب"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedOrder && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p>
                  <strong>رقم الطلب:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>العميل:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>الهاتف:</strong> {selectedOrder.customerPhone}
                </p>
              </div>
            )}

            {notifyReason === "accept" ? (
              <p>سيتم إرسال رسالة واتساب إلى العميل لإبلاغه بقبول الطلب.</p>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="rejectReason">سبب الرفض</Label>
                <textarea
                  id="rejectReason"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="أدخل سبب رفض الطلب"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotifyCustomerDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={sendCustomerNotification}
              disabled={notifyReason === "reject" && !rejectReason}
            >
              إرسال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersManagement;
