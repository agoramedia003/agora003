export interface LoyaltyCard {
  id: string;
  title: string;
  type: "gift" | "reward" | "coins";
  code: string;
  expiryDate: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  ownerId?: string;
  ownerName?: string;
  description?: string;
}

export interface GiftCard extends LoyaltyCard {
  type: "gift";
  giftType: "discount" | "gift";
  discountValue?: number;
  imageUrl?: string;
}

export interface CoinsCard extends LoyaltyCard {
  type: "coins";
  coinsAmount: number;
}

export interface StampStage {
  required: number;
  current: number;
  reward: string;
  rewardType: "discount" | "gift";
  discountValue?: number;
}

export interface Stamp {
  id: string;
  cardId: string;
  code: string;
  isActive: boolean;
  activatedBy?: string;
  activatedAt?: string;
}

export interface RewardCard extends LoyaltyCard {
  type: "reward";
  stages: StampStage[];
  stamps: Stamp[];
}
