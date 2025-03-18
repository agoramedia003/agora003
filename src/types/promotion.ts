export interface Promotion {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
  startDate: string;
  endDate: string;
}

export interface FlashDeal extends Promotion {
  timeRemaining: string;
}
