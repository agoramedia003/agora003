import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface CardActivationProps {
  onActivateCard: (
    code: string,
  ) => Promise<{ success: boolean; message: string; card?: any }>;
}

const CardActivation = ({ onActivateCard }: CardActivationProps) => {
  const [cardCode, setCardCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleActivateCard = async () => {
    if (!cardCode.trim()) {
      setErrorMessage("يرجى إدخال رمز البطاقة");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await onActivateCard(cardCode);
      if (result.success) {
        setSuccessMessage(result.message);
        setCardCode("");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء تفعيل البطاقة");
      console.error("Card activation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          تفعيل بطاقة جديدة
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
              أدخل رمز البطاقة لتفعيلها وإضافتها إلى حسابك
            </p>
            <Input
              placeholder="أدخل رمز البطاقة"
              value={cardCode}
              onChange={(e) => setCardCode(e.target.value)}
              className="text-center text-lg tracking-wider"
              maxLength={10}
            />
          </div>
          <Button
            onClick={handleActivateCard}
            disabled={isLoading || !cardCode.trim()}
            className="w-full"
          >
            {isLoading ? "جاري التفعيل..." : "تفعيل البطاقة"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardActivation;
