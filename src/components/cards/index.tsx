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
import { Gift, Coins, Calendar, Check, X } from "lucide-react";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface GiftCard {
  id: string;
  title: string;
  type: "gift" | "reward" | "coins";
  code: string;
  expiryDate: string;
  backgroundColor: string;
  textColor: string;
  coinsAmount?: number;
  stamps?: {
    required: number;
    current: number;
    reward: string;
  }[];
}

const CardsDiscoveryPage = () => {
  const [activationCode, setActivationCode] = useState("");
  const [cardDetails, setCardDetails] = useState<GiftCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // This would normally come from your backend
  const availableCards: Record<string, GiftCard> = {
    GIFT123: {
      id: "1",
      title: "بطاقة هدية وجبة غداء",
      type: "gift",
      code: "GIFT123",
      expiryDate: "2023-12-31",
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
    },
    REWARD456: {
      id: "2",
      title: "بطاقة مكافآت برجر",
      type: "reward",
      code: "REWARD456",
      expiryDate: "2023-12-31",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      stamps: [
        { required: 5, current: 0, reward: "برجر مجاني" },
        { required: 10, current: 0, reward: "وجبة كاملة مجانية" },
      ],
    },
    COINS789: {
      id: "3",
      title: "بطاقة كوينز",
      type: "coins",
      code: "COINS789",
      expiryDate: "2023-12-31",
      backgroundColor: "#f59e0b",
      textColor: "#ffffff",
      coinsAmount: 500,
    },
  };

  const handleActivateCard = () => {
    // Reset states
    setError(null);
    setSuccess(null);
    setCardDetails(null);

    // Check if code exists
    if (activationCode in availableCards) {
      setCardDetails(availableCards[activationCode]);
    } else {
      setError("رمز التفعيل غير صالح. يرجى التحقق والمحاولة مرة أخرى.");
    }
  };

  const handleAddCardToAccount = () => {
    if (!cardDetails) return;

    // This would normally send a request to your backend
    // For now, we'll just show a success message
    setSuccess(`تم إضافة ${cardDetails.title} إلى حسابك بنجاح!`);

    // Reset after a few seconds
    setTimeout(() => {
      setSuccess(null);
      setCardDetails(null);
      setActivationCode("");
    }, 3000);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">اكتشاف البطاقات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>تفعيل بطاقة جديدة</CardTitle>
              <CardDescription>
                أدخل رمز التفعيل لإضافة بطاقة هدية أو مكافأة إلى حسابك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activationCode">رمز التفعيل</Label>
                  <div className="flex gap-2">
                    <Input
                      id="activationCode"
                      placeholder="أدخل رمز التفعيل"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                    />
                    <Button onClick={handleActivateCard}>تحقق</Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert
                    variant="default"
                    className="bg-green-50 border-green-200 text-green-800"
                  >
                    <Check className="h-4 w-4" />
                    <AlertTitle>تم بنجاح</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {cardDetails && (
            <Card
              style={{ backgroundColor: cardDetails.backgroundColor }}
              className="overflow-hidden"
            >
              <CardHeader>
                <CardTitle style={{ color: cardDetails.textColor }}>
                  {cardDetails.title}
                </CardTitle>
                <CardDescription
                  style={{ color: `${cardDetails.textColor}99` }}
                >
                  رقم البطاقة: {cardDetails.code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="flex items-center"
                    style={{ color: cardDetails.textColor }}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>صالحة حتى: {cardDetails.expiryDate}</span>
                  </div>

                  {cardDetails.type === "reward" && cardDetails.stamps && (
                    <div
                      className="space-y-3"
                      style={{ color: cardDetails.textColor }}
                    >
                      <h3 className="font-medium">مراحل المكافأة:</h3>
                      {cardDetails.stamps.map((stamp, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>
                              المرحلة {index + 1}: {stamp.reward}
                            </span>
                            <span>
                              {stamp.current}/{stamp.required}
                            </span>
                          </div>
                          <Progress
                            value={(stamp.current / stamp.required) * 100}
                            className="h-2"
                            style={{
                              backgroundColor: `${cardDetails.textColor}33`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {cardDetails.type === "coins" && cardDetails.coinsAmount && (
                    <div
                      className="flex items-center text-xl font-bold"
                      style={{ color: cardDetails.textColor }}
                    >
                      <Coins className="h-6 w-6 mr-2" />
                      <span>{cardDetails.coinsAmount} كوينز</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{
                    borderColor: cardDetails.textColor,
                    color: cardDetails.textColor,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  onClick={handleAddCardToAccount}
                >
                  {cardDetails.type === "coins"
                    ? "إضافة الكوينز إلى رصيدي"
                    : "إضافة البطاقة إلى حسابي"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">كيفية استخدام البطاقات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">بطاقات الهدايا</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  بطاقات الهدايا تمنحك وجبات مجانية أو خصومات على طلباتك
                  القادمة. يمكنك استخدامها مرة واحدة فقط.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">بطاقات المكافآت</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  بطاقات المكافآت تتيح لك جمع الطوابع مع كل طلب. عند الوصول إلى
                  عدد معين من الطوابع، تحصل على مكافآت مجانية.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-amber-100">
                    <Coins className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">بطاقات الكوينز</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  بطاقات الكوينز تضيف رصيداً من الكوينز إلى محفظتك، يمكنك
                  استخدامه للحصول على خصومات على طلباتك.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CardsDiscoveryPage;
