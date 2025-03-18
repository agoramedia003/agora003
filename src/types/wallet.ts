export interface Transaction {
  id: string;
  type: "add" | "spend" | "receive" | "send";
  amount: number;
  date: string;
  description: string;
  recipientPhone?: string;
  senderPhone?: string;
}

export interface CoinTransfer {
  id: string;
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  date: string;
  status: "pending" | "completed" | "failed";
}
