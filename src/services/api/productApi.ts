import apiClient from "./apiClient";

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  options?: ProductOption[];
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  discountPercentage?: number;
}

const productApi = {
  getCategories: async (): Promise<ProductCategory[]> => {
    return apiClient.get<ProductCategory[]>("/categories");
  },

  getProducts: async (categoryId?: string): Promise<Product[]> => {
    const params = categoryId ? { categoryId } : {};
    return apiClient.get<Product[]>("/products", params);
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  getPopularProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products/popular");
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products/search", { query });
  },
};

export default productApi;
