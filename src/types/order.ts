import { LoyaltyCard } from "./loyalty";

export interface OrderItem {
  id: string;
  productName: string;
  productDescription: string;
  quantity: number;
  price: number;
  extras?: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryTime: "asap" | "scheduled";
  scheduledTime?: string;
}

export interface Order {
  id: string;
  date: string;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  subtotal: number;
  extrasTotal: number;
  discount: number;
  total: number;
  deliveryInfo: DeliveryInfo;
  paymentMethod: "cash" | "coins";
  appliedLoyaltyCard?: LoyaltyCard;
}

export interface StatusInfo {
  label: string;
  step: number;
  timestamp: string;
  estimatedDeliveryTime?: string;
}

export interface StatusHistoryItem {
  status: string;
  label: string;
  timestamp: string;
}

export interface OrderStatus {
  id: string;
  status: string;
  statusInfo: StatusInfo;
  statusHistory: StatusHistoryItem[];
}
