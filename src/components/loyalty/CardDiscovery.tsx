import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertCircle, Search, CreditCard } from "lucide-react";
import CardDetails from "./CardDetails";

interface CardDiscoveryProps {
  onDiscoverCard: (code: string) => Promise<{
    success: boolean;
    message: string;
    card?: any;
  }>;
  onAddToAccount: (
    cardId: string,
  ) => Promise<{ success: boolean; message: string }>;
}

const CardDiscovery = ({
  onDiscoverCard,
  onAddToAccount,
}: CardDiscoveryProps) => {
  const [cardCode, setCardCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [discoveredCard, setDiscoveredCard] = useState<any | null>(null);
  const [isAddingToAccount, setIsAddingToAccount] = useState(false);

  const handleDiscoverCard = async () => {
    if (!cardCode.trim()) {
      setErrorMessage("يرجى إدخال رمز البطاقة");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setDiscoveredCard(null);

    try {
      const result = await onDiscoverCard(cardCode);
      if (result.success && result.card) {
        setDiscoveredCard(result.card);
        setSuccessMessage("تم العثور على البطاقة بنجاح");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء البحث عن البطاقة");
      console.error("Card discovery error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToAccount = async () => {
    if (!discoveredCard) return;

    setIsAddingToAccount(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await onAddToAccount(discoveredCard.id);
      if (result.success) {
        setSuccessMessage(result.message);
        setDiscoveredCard(null);
        setCardCode("");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء إضافة البطاقة إلى حسابك");
      console.error("Add card to account error:", error);
    } finally {
      setIsAddingToAccount(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          اكتشاف البطاقات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              أدخل رمز البطاقة للتحقق من معلوماتها
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="أدخل رمز البطاقة"
                value={cardCode}
                onChange={(e) => setCardCode(e.target.value)}
                className="text-center text-lg tracking-wider"
                maxLength={10}
              />
              <Button
                onClick={handleDiscoverCard}
                disabled={isLoading || !cardCode.trim()}
                variant="outline"
              >
                <Search className="h-4 w-4 mr-2" />
                بحث
              </Button>
            </div>
          </div>

          {discoveredCard && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">معلومات البطاقة:</h3>
              <CardDetails card={discoveredCard} />
              <Button
                onClick={handleAddToAccount}
                disabled={isAddingToAccount}
                className="w-full"
              >
                {isAddingToAccount ? "جاري الإضافة..." : "أضف إلى حسابي"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDiscovery;
