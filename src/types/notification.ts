export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "order_status" | "promotion" | "loyalty" | "system";
  read: boolean;
  createdAt: string;
  data?: any;
}
