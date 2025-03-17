import React, { useState } from "react";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Award,
  Gift,
  Check,
  X,
  Clock,
  CreditCard,
  Banknote,
  Coins,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  image: string;
  extras?: { name: string; price: number }[];
}

interface LoyaltyCard {
  id: string;
  title: string;
  type: "gift" | "reward";
  code: string;
  expiryDate: string;
  backgroundColor: string;
  textColor: string;
  stamps?: {
    required: number;
    current: number;
    reward: string;
  }[];
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "برجر دجاج مقرمش",
      description: "برجر دجاج مقرمش مع صلصة خاصة",
      price: 45,
      discountPrice: 35,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
      extras: [
        { name: "جبنة إضافية", price: 5 },
        { name: "صلصة حارة", price: 3 },
      ],
    },
    {
      id: "2",
      name: "بيتزا خضار",
      description: "بيتزا طازجة مع تشكيلة من الخضروات",
      price: 60,
      discountPrice: 45,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
    },
  ]);

  const [deliveryTime, setDeliveryTime] = useState<"asap" | "scheduled">(
    "asap",
  );
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "محمد أحمد",
    phone: "+966 50 123 4567",
    address: "شارع الملك فهد، الرياض",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "coins">("cash");

  // Loyalty program states
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([
    {
      id: "1",
      title: "بطاقة مكافآت برجر",
      type: "reward",
      code: "REWARD123",
      expiryDate: "2023-12-31",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      stamps: [
        { required: 5, current: 3, reward: "برجر مجاني" },
        { required: 10, current: 0, reward: "وجبة كاملة مجانية" },
      ],
    },
    {
      id: "2",
      title: "بطاقة هدية وجبة غداء",
      type: "gift",
      code: "GIFT456",
      expiryDate: "2023-12-31",
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
    },
  ]);

  const [selectedLoyaltyCard, setSelectedLoyaltyCard] =
    useState<LoyaltyCard | null>(null);
  const [loyaltyAction, setLoyaltyAction] = useState<
    "collect" | "redeem" | "request"
  >("collect");
  const [stampCode, setStampCode] = useState("");
  const [showStampDialog, setShowStampDialog] = useState(false);
  const [stampSuccess, setStampSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState("");

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0,
    );
  };

  const calculateExtrasTotal = () => {
    return cartItems.reduce((sum, item) => {
      const extrasTotal = item.extras
        ? item.extras.reduce((extSum, ext) => extSum + ext.price, 0) *
          item.quantity
        : 0;
      return sum + extrasTotal;
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price - item.discountPrice) * item.quantity,
      0,
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateExtrasTotal();
  };

  const handleAddStamp = () => {
    if (
      stampCode &&
      selectedLoyaltyCard &&
      selectedLoyaltyCard.type === "reward"
    ) {
      // Simulate stamp validation
      if (stampCode === "STAMP123" || stampCode.length >= 6) {
        setLoyaltyCards((prev) =>
          prev.map((card) => {
            if (card.id === selectedLoyaltyCard.id && card.stamps) {
              const updatedStamps = card.stamps.map((stamp, index) => {
                if (index === 0 && stamp.current < stamp.required) {
                  return { ...stamp, current: stamp.current + 1 };
                }
                return stamp;
              });
              return { ...card, stamps: updatedStamps };
            }
            return card;
          }),
        );
        setStampSuccess(true);
        setTimeout(() => {
          setStampSuccess(false);
          setShowStampDialog(false);
          setStampCode("");
        }, 2000);
      } else {
        // Show error
        alert("رمز الطابع غير صالح");
      }
    }
  };

  const handleSubmitOrder = () => {
    // Generate order summary
    const orderNumber = Math.floor(Math.random() * 10000);
    const orderDate = new Date().toLocaleString("ar-SA");

    let summary = `<div class="text-center">
      <div class="mb-4 flex justify-center">
        <div class="rounded-full bg-green-100 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h3 class="text-lg font-bold mb-2">تم تقديم طلبك بنجاح!</h3>
      <p class="text-sm text-gray-500 mb-4">رقم الطلب: #${orderNumber}</p>
    </div>
    
    <div class="border-t pt-4 mt-4">
      <h4 class="font-medium mb-2">ملخص الطلب:</h4>
      <ul class="space-y-2 mb-4">`;

    cartItems.forEach((item) => {
      summary += `<li class="flex justify-between">
        <span>${item.name} x${item.quantity}</span>
        <span>${item.discountPrice * item.quantity} ر.س</span>
      </li>`;

      if (item.extras && item.extras.length > 0) {
        item.extras.forEach((extra) => {
          summary += `<li class="flex justify-between text-sm text-gray-500 pr-4">
            <span>+ ${extra.name}</span>
            <span>${extra.price * item.quantity} ر.س</span>
          </li>`;
        });
      }
    });

    summary += `</ul>
      <div class="flex justify-between font-medium">
        <span>المجموع الفرعي:</span>
        <span>${calculateSubtotal()} ر.س</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>الإضافات:</span>
        <span>${calculateExtrasTotal()} ر.س</span>
      </div>
      <div class="flex justify-between text-sm text-green-600">
        <span>الخصم:</span>
        <span>- ${calculateDiscount()} ر.س</span>
      </div>
      <div class="flex justify-between font-bold mt-2 pt-2 border-t">
        <span>المجموع:</span>
        <span>${calculateTotal()} ر.س</span>
      </div>
    </div>
    
    <div class="border-t pt-4 mt-4">
      <h4 class="font-medium mb-2">معلومات التوصيل:</h4>
      <p class="text-sm">${customerInfo.name}</p>
      <p class="text-sm">${customerInfo.phone}</p>
      <p class="text-sm">${customerInfo.address}</p>
      <p class="text-sm mt-2">وقت التوصيل: ${deliveryTime === "asap" ? "أسرع وقت ممكن" : scheduledTime}</p>
      <p class="text-sm mt-2">طريقة الدفع: ${paymentMethod === "cash" ? "الدفع عند الاستلام" : "رصيد الكوينز"}</p>
    </div>`;

    // Add loyalty program details if selected
    if (selectedLoyaltyCard) {
      summary += `<div class="border-t pt-4 mt-4">
        <h4 class="font-medium mb-2">برنامج الولاء:</h4>`;

      if (selectedLoyaltyCard.type === "reward") {
        if (loyaltyAction === "redeem") {
          summary += `<div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p class="text-sm">تم استخدام مكافأة: ${selectedLoyaltyCard.stamps && selectedLoyaltyCard.stamps[0].reward}</p>
          </div>
          <p class="text-sm text-gray-500">رقم البطاقة: ${selectedLoyaltyCard.code}</p>`;
        } else if (loyaltyAction === "request") {
          summary += `<div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p class="text-sm">سيتم إرسال رمز تفعيل الطابع مع الطلب</p>
          </div>
          <p class="text-sm text-gray-500">رقم البطاقة: ${selectedLoyaltyCard.code}</p>`;
        }
      } else if (selectedLoyaltyCard.type === "gift") {
        summary += `<div class="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <p class="text-sm">تم استخدام بطاقة هدية: ${selectedLoyaltyCard.title}</p>
        </div>
        <p class="text-sm text-gray-500">رقم البطاقة: ${selectedLoyaltyCard.code}</p>`;
      }

      summary += `</div>`;
    }

    setOrderSummary(summary);
    setOrderSuccess(true);

    // In a real app, you would submit the order to your backend here
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">سلة المشتريات</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-gray-100 p-6 mb-4">
                  <ArrowRight className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">السلة فارغة</h3>
                <p className="text-gray-500 mb-6">
                  لم تقم بإضافة أي منتجات إلى السلة بعد
                </p>
                <Button onClick={() => navigate("/store")}>تصفح المتجر</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {/* Cart Items */}
              <Card>
                <CardHeader>
                  <CardTitle>المنتجات ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row border rounded-lg p-3 sm:p-4"
                    >
                      <div className="w-full sm:w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mb-3 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 sm:mx-4">
                        <h3 className="font-medium text-sm sm:text-base">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                          {item.description}
                        </p>
                        {item.extras && item.extras.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-600">الإضافات:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.extras.map((extra, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                                >
                                  {extra.name} (+{extra.price} ر.س)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between mt-3 sm:mt-0">
                        <div className="text-left">
                          <div className="font-bold text-sm sm:text-base">
                            {item.discountPrice} ر.س
                          </div>
                          {item.price > item.discountPrice && (
                            <div className="text-xs sm:text-sm text-gray-500 line-through">
                              {item.price} ر.س
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Loyalty Program */}
              <Card>
                <CardHeader>
                  <CardTitle>برنامج الولاء</CardTitle>
                  <CardDescription>
                    استخدم بطاقات المكافآت والهدايا مع طلبك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="rewards" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger
                        value="rewards"
                        className="flex items-center gap-2"
                      >
                        <Award className="h-4 w-4" />
                        بطاقات المكافآت
                      </TabsTrigger>
                      <TabsTrigger
                        value="gifts"
                        className="flex items-center gap-2"
                      >
                        <Gift className="h-4 w-4" />
                        بطاقات الهدايا
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rewards" className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 max-h-[200px] overflow-y-auto pr-1">
                        {loyaltyCards
                          .filter((card) => card.type === "reward")
                          .map((card) => (
                            <div
                              key={card.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedLoyaltyCard?.id === card.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                              onClick={() => setSelectedLoyaltyCard(card)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{card.title}</h4>
                                  <p className="text-xs text-gray-500">
                                    رقم البطاقة: {card.code}
                                  </p>
                                </div>
                                <Checkbox
                                  checked={selectedLoyaltyCard?.id === card.id}
                                  onCheckedChange={() => {
                                    if (selectedLoyaltyCard?.id === card.id) {
                                      setSelectedLoyaltyCard(null);
                                    } else {
                                      setSelectedLoyaltyCard(card);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      {selectedLoyaltyCard &&
                        selectedLoyaltyCard.type === "reward" && (
                          <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">الإجراء</h4>
                              <div className="flex gap-2">
                                <Button
                                  variant={
                                    loyaltyAction === "request"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setLoyaltyAction("request")}
                                >
                                  طلب طابع
                                </Button>
                                <Button
                                  variant={
                                    loyaltyAction === "redeem"
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setLoyaltyAction("redeem")}
                                  disabled={
                                    !selectedLoyaltyCard.stamps ||
                                    selectedLoyaltyCard.stamps[0].current <
                                      selectedLoyaltyCard.stamps[0].required
                                  }
                                >
                                  استبدال مكافأة
                                </Button>
                              </div>
                            </div>

                            {loyaltyAction === "redeem" && (
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <p className="font-medium text-green-800">
                                  سيتم استبدال مكافأة:{" "}
                                  {selectedLoyaltyCard.stamps &&
                                    selectedLoyaltyCard.stamps[0].reward}
                                </p>
                              </div>
                            )}

                            {loyaltyAction === "request" && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <Bell className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                <p className="font-medium text-blue-800">
                                  سيتم إرسال رمز تفعيل الطابع مع الطلب
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                    </TabsContent>

                    <TabsContent value="gifts" className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 max-h-[200px] overflow-y-auto pr-1">
                        {loyaltyCards
                          .filter((card) => card.type === "gift")
                          .map((card) => (
                            <div
                              key={card.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedLoyaltyCard?.id === card.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"}`}
                              onClick={() => setSelectedLoyaltyCard(card)}
                              style={{
                                borderColor:
                                  selectedLoyaltyCard?.id === card.id
                                    ? card.backgroundColor
                                    : undefined,
                                backgroundColor:
                                  selectedLoyaltyCard?.id === card.id
                                    ? `${card.backgroundColor}10`
                                    : undefined,
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{card.title}</h4>
                                  <p className="text-xs text-gray-500">
                                    رقم البطاقة: {card.code}
                                  </p>
                                </div>
                                <Checkbox
                                  checked={selectedLoyaltyCard?.id === card.id}
                                  onCheckedChange={() => {
                                    if (selectedLoyaltyCard?.id === card.id) {
                                      setSelectedLoyaltyCard(null);
                                    } else {
                                      setSelectedLoyaltyCard(card);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      {selectedLoyaltyCard &&
                        selectedLoyaltyCard.type === "gift" && (
                          <div className="mt-4 border-t pt-4 text-center p-3 bg-blue-50 rounded-lg">
                            <Gift className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="font-medium text-blue-800">
                              سيتم استخدام بطاقة الهدية مع هذا الطلب
                            </p>
                          </div>
                        )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التوصيل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    وقت التوصيل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryTime}
                    onValueChange={(value) =>
                      setDeliveryTime(value as "asap" | "scheduled")
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="asap" id="asap" />
                      <Label htmlFor="asap">أسرع وقت ممكن</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled">تحديد وقت</Label>
                    </div>
                  </RadioGroup>

                  {deliveryTime === "scheduled" && (
                    <div className="mt-4">
                      <Label htmlFor="time">اختر الوقت</Label>
                      <select
                        id="time"
                        className="w-full mt-1 p-2 border rounded-md"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      >
                        <option value="">اختر وقت التوصيل</option>
                        {Array.from({ length: 12 }).map((_, i) => {
                          const hour = i + 9; // Start from 9 AM
                          return (
                            <React.Fragment key={i}>
                              <option
                                value={`${hour}:00`}
                              >{`${hour}:00`}</option>
                              <option
                                value={`${hour}:30`}
                              >{`${hour}:30`}</option>
                            </React.Fragment>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as "cash" | "coins")
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-green-600" />
                        الدفع عند الاستلام
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="coins" id="coins" />
                      <Label
                        htmlFor="coins"
                        className="flex items-center gap-2"
                      >
                        <Coins className="h-4 w-4 text-amber-500" />
                        الدفع من رصيد الكوينز
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "coins" && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <p className="font-medium">رصيدك الحالي: 1250 كوينز</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        سيتم خصم {calculateTotal()} كوينز من رصيدك
                      </p>
                      {calculateTotal() > 1250 && (
                        <p className="text-sm text-red-500 mt-2">
                          رصيدك غير كافي لإتمام عملية الدفع
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span>{calculateSubtotal()} ر.س</span>
                  </div>
                  {calculateExtrasTotal() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإضافات</span>
                      <span>{calculateExtrasTotal()} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">رسوم التوصيل</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>- {calculateDiscount()} ر.س</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع</span>
                    <span>{calculateTotal()} ر.س</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmitOrder}
                    disabled={
                      paymentMethod === "coins" && calculateTotal() > 1250
                    }
                  >
                    تقديم الطلب
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Add Stamp Dialog */}
      <Dialog open={showStampDialog} onOpenChange={setShowStampDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة طابع</DialogTitle>
            <DialogDescription>
              أدخل رمز الطابع لإضافته إلى بطاقة المكافآت
            </DialogDescription>
          </DialogHeader>

          {stampSuccess ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>تم بنجاح</AlertTitle>
              <AlertDescription>
                تم إضافة الطابع بنجاح إلى بطاقة المكافآت
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="stampCode">رمز الطابع</Label>
                  <Input
                    id="stampCode"
                    placeholder="أدخل رمز الطابع"
                    value={stampCode}
                    onChange={(e) => setStampCode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddStamp}>
                  إضافة الطابع
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent className="sm:max-w-[500px]">
          <div dangerouslySetInnerHTML={{ __html: orderSummary }} />
          <DialogFooter>
            <Button
              onClick={() => {
                setOrderSuccess(false);
                // Clear cart after successful order
                setCartItems([]);
                navigate("/orders");
              }}
            >
              متابعة طلباتي
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CartPage;
