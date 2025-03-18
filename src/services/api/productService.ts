import apiClient from "./apiClient";
import { Product, Category, ProductExtra } from "../../types/product";

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  search?: string;
}

const ProductService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products", filters);
  },

  /**
   * Get a specific product by ID
   */
  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Get all product categories
   */
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>("/products/categories");
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products", { featured: true });
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products", { category: categoryId });
  },

  /**
   * Get available product extras (toppings, options, etc.)
   */
  getProductExtras: async (): Promise<ProductExtra[]> => {
    return apiClient.get<ProductExtra[]>("/products/extras");
  },

  /**
   * Get product components
   */
  getProductComponents: async (productId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/products/${productId}/components`);
  },
};

export default ProductService;
