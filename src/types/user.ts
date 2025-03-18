export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  coinsBalance: number;
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  postalCode?: string;
  additionalInfo?: string;
  isDefault: boolean;
}

export interface UserProfile extends User {
  addresses: Address[];
}
