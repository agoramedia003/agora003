import { Product } from "./product";
import { LoyaltyCard } from "./loyalty";

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    shortDescription: string;
    price: number;
    discountPrice: number;
    image: string;
  };
  quantity: number;
  extras?: CartExtra[];
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  extrasTotal: number;
  discount: number;
  total: number;
  appliedLoyaltyCard?: LoyaltyCard;
}
