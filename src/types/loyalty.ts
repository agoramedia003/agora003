export interface LoyaltyCard {
  id: string;
  title: string;
  type: "gift" | "reward";
  code: string;
  expiryDate: string;
  backgroundColor: string;
  textColor: string;
}

export interface GiftCard extends LoyaltyCard {
  type: "gift";
  coinsAmount?: number;
}

export interface StampStage {
  required: number;
  current: number;
  reward: string;
}

export interface RewardCard extends LoyaltyCard {
  type: "reward";
  stamps: StampStage[];
}
