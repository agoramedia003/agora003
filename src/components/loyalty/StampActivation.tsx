import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertCircle, Stamp } from "lucide-react";

interface StampActivationProps {
  cardId: string;
  onActivateStamp: (
    cardId: string,
    code: string,
  ) => Promise<{ success: boolean; message: string }>;
}

const StampActivation = ({ cardId, onActivateStamp }: StampActivationProps) => {
  const [stampCode, setStampCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleActivateStamp = async () => {
    if (!stampCode.trim()) {
      setErrorMessage("يرجى إدخال رمز الطابع");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await onActivateStamp(cardId, stampCode);
      if (result.success) {
        setSuccessMessage(result.message);
        setStampCode("");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء تفعيل الطابع");
      console.error("Stamp activation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Stamp className="h-5 w-5 text-primary" />
          تفعيل طابع جديد
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
              أدخل رمز الطابع لتفعيله وإضافته إلى بطاقة المكافآت
            </p>
            <Input
              placeholder="أدخل رمز الطابع"
              value={stampCode}
              onChange={(e) => setStampCode(e.target.value)}
              className="text-center text-lg tracking-wider"
              maxLength={6}
            />
          </div>
          <Button
            onClick={handleActivateStamp}
            disabled={isLoading || !stampCode.trim()}
            className="w-full"
          >
            {isLoading ? "جاري التفعيل..." : "تفعيل الطابع"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StampActivation;
