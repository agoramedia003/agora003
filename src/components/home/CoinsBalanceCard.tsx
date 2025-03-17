import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Coins, ArrowRight, Send } from "lucide-react";
import { cn } from "../../lib/utils";

interface CoinsBalanceCardProps {
  balance?: number;
  onSendCoins?: () => void;
  onViewHistory?: () => void;
}

const CoinsBalanceCard = ({
  balance = 1250,
  onSendCoins = () => {},
  onViewHistory = () => {},
}: CoinsBalanceCardProps) => {
  return (
    <Card className="w-full max-w-[350px] bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
          <Coins className="h-5 w-5 mr-2 text-amber-500" />
          رصيد الكوينز
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">{balance}</span>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-sm"
                onClick={onSendCoins}
              >
                <Send className="h-4 w-4" />
                تحويل
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-sm"
                onClick={onViewHistory}
              >
                السجل
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            يمكنك استخدام الكوينز للحصول على خصومات وهدايا مجانية
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinsBalanceCard;
