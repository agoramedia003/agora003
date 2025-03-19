import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Award, Gift, Coins, Calendar, Stamp, CheckCircle } from "lucide-react";

interface RewardStage {
  required: number;
  current?: number;
  reward: string;
  rewardType: "gift" | "discount";
  discountValue?: number;
}

interface RewardStamp {
  id: string;
  cardId: string;
  code: string;
  isActive: boolean;
  activatedBy?: string;
  activatedAt?: string;
}

interface BaseCard {
  id: string;
  title: string;
  type: "reward" | "gift" | "coins";
  code: string;
  expiryDate?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
  ownerId?: string;
}

interface RewardCard extends BaseCard {
  type: "reward";
  description?: string;
  stages: RewardStage[];
  stamps: RewardStamp[];
}

interface GiftCard extends BaseCard {
  type: "gift";
  giftType: "discount" | "gift";
  discountValue?: number;
  imageUrl?: string;
}

interface CoinsCard extends BaseCard {
  type: "coins";
  coinsAmount: number;
}

interface CardDetailsProps {
  card: RewardCard | GiftCard | CoinsCard;
  onUseCard?: (cardId: string) => void;
  onActivateStamp?: (cardId: string) => void;
}

const CardDetails = ({
  card,
  onUseCard,
  onActivateStamp,
}: CardDetailsProps) => {
  const isRewardCard = card.type === "reward";
  const isGiftCard = card.type === "gift";
  const isCoinsCard = card.type === "coins";

  const getCardIcon = () => {
    switch (card.type) {
      case "reward":
        return <Award className="h-5 w-5 text-primary" />;
      case "gift":
        return <Gift className="h-5 w-5 text-primary" />;
      case "coins":
        return <Coins className="h-5 w-5 text-primary" />;
    }
  };

  const getExpiryDate = () => {
    if (!card.expiryDate) return null;

    const date = new Date(card.expiryDate);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = (rewardCard: RewardCard) => {
    if (!rewardCard.stages || rewardCard.stages.length === 0) return 0;

    const totalStamps =
      rewardCard.stamps?.filter((stamp) => stamp.isActive).length || 0;
    const requiredStamps = rewardCard.stages[0].required;

    return Math.min(Math.round((totalStamps / requiredStamps) * 100), 100);
  };

  return (
    <Card
      className="w-full overflow-hidden"
      style={{
        backgroundColor: card.backgroundColor || "#ffffff",
        color: card.textColor || "#000000",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
          {getCardIcon()}
        </div>
        <Badge variant="outline" className="mt-1 border-current text-current">
          {card.code}
        </Badge>
      </CardHeader>

      <CardContent>
        {isRewardCard && (card as RewardCard).stages && (
          <div className="space-y-4">
            {(card as RewardCard).description && (
              <p className="text-sm opacity-90">
                {(card as RewardCard).description}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>التقدم</span>
                <span>
                  {(card as RewardCard).stamps?.filter(
                    (stamp) => stamp.isActive,
                  ).length || 0}{" "}
                  /{(card as RewardCard).stages[0].required}
                </span>
              </div>
              <Progress
                value={calculateProgress(card as RewardCard)}
                className="h-2 bg-opacity-20 bg-current"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">المراحل:</h4>
              <div className="space-y-2">
                {(card as RewardCard).stages.map((stage, index) => {
                  const activeStamps =
                    (card as RewardCard).stamps?.filter(
                      (stamp) => stamp.isActive,
                    ).length || 0;
                  const isCompleted = activeStamps >= stage.required;

                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-md border border-current border-opacity-20 flex justify-between items-center ${isCompleted ? "bg-current bg-opacity-10" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted && <CheckCircle className="h-4 w-4" />}
                        <span>
                          المرحلة {index + 1}: {stage.reward}
                          {stage.rewardType === "discount" &&
                            stage.discountValue &&
                            ` (خصم ${stage.discountValue}%)`}
                        </span>
                      </div>
                      <span className="text-sm">{stage.required} طوابع</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isGiftCard && (
          <div className="space-y-4">
            {(card as GiftCard).imageUrl && (
              <div className="w-full h-32 rounded-md overflow-hidden">
                <img
                  src={(card as GiftCard).imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <span>النوع:</span>
                <span>
                  {(card as GiftCard).giftType === "discount" ? "خصم" : "هدية"}
                  {(card as GiftCard).giftType === "discount" &&
                    (card as GiftCard).discountValue &&
                    ` (${(card as GiftCard).discountValue}%)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {isCoinsCard && (
          <div className="space-y-4">
            <div className="flex justify-center items-center p-4">
              <div className="text-center">
                <Coins className="h-10 w-10 mx-auto mb-2" />
                <div className="text-3xl font-bold">
                  {(card as CoinsCard).coinsAmount}
                </div>
                <div className="text-sm opacity-80">كوينز</div>
              </div>
            </div>
          </div>
        )}

        {card.expiryDate && (
          <div className="mt-4 flex items-center gap-1 text-sm opacity-80">
            <Calendar className="h-4 w-4" />
            <span>تاريخ الانتهاء: {getExpiryDate()}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {isRewardCard && onActivateStamp && (
          <Button
            variant="outline"
            className="w-full border-current text-current hover:bg-current hover:bg-opacity-10"
            onClick={() => onActivateStamp(card.id)}
          >
            <Stamp className="h-4 w-4 mr-2" />
            تفعيل طابع
          </Button>
        )}

        {(isGiftCard ||
          (isRewardCard &&
            (card as RewardCard).stages?.some((stage) => {
              const activeStamps =
                (card as RewardCard).stamps?.filter((stamp) => stamp.isActive)
                  .length || 0;
              return activeStamps >= stage.required;
            }))) &&
          onUseCard && (
            <Button
              className="w-full bg-current bg-opacity-20 hover:bg-opacity-30 text-current"
              onClick={() => onUseCard(card.id)}
            >
              استخدام
            </Button>
          )}
      </CardFooter>
    </Card>
  );
};

export default CardDetails;
