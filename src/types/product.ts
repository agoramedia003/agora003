export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface ProductComponent {
  id: string;
  name: string;
  quantity: number;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice: number;
  coinsPrice: number;
  image: string;
  category: Category;
  featured: boolean;
  components?: ProductComponent[];
}
