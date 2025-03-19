import { useState, useEffect, useCallback } from "react";
import cartService from "../services/api/cartService";
import { Cart, CartItem } from "../types/cart";

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!localStorage.getItem("isLoggedIn")) return;

    setIsLoading(true);
    setError(null);
    try {
      if (import.meta.env.VITE_TEMPO !== "true") {
        const cartData = await cartService.getCart();
        setCart(cartData);
      } else {
        // Mock cart for Tempo environment
        // This would be replaced with actual API call in production
        const mockCart: Cart = {
          id: "cart-1",
          items: [],
          subtotal: 0,
          deliveryFee: 10,
          discount: 0,
          total: 10,
        };
        setCart(mockCart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("فشل في تحميل سلة التسوق");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = async (
    productId: string,
    quantity: number,
    extras?: { id: string; quantity: number }[],
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      if (import.meta.env.VITE_TEMPO !== "true") {
        const updatedCart = await cartService.addToCart({
          productId,
          quantity,
          extras,
        });
        setCart(updatedCart);
        return { success: true };
      } else {
        // Mock adding to cart for Tempo environment
        // This would be replaced with actual API call in production
        setTimeout(() => {
          setCart((prevCart) => {
            if (!prevCart) return null;
            // Mock implementation
            return { ...prevCart };
          });
        }, 500);
        return { success: true };
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("فشل في إضافة المنتج إلى السلة");
      return { success: false, error: "فشل في إضافة المنتج إلى السلة" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (import.meta.env.VITE_TEMPO !== "true") {
        const updatedCart = await cartService.updateCartItem(itemId, quantity);
        setCart(updatedCart);
        return { success: true };
      } else {
        // Mock updating cart for Tempo environment
        setTimeout(() => {
          setCart((prevCart) => {
            if (!prevCart) return null;
            // Mock implementation
            return { ...prevCart };
          });
        }, 500);
        return { success: true };
      }
    } catch (err) {
      console.error("Error updating cart item:", err);
      setError("فشل في تحديث السلة");
      return { success: false, error: "فشل في تحديث السلة" };
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (itemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (import.meta.env.VITE_TEMPO !== "true") {
        const updatedCart = await cartService.removeCartItem(itemId);
        setCart(updatedCart);
        return { success: true };
      } else {
        // Mock removing from cart for Tempo environment
        setTimeout(() => {
          setCart((prevCart) => {
            if (!prevCart) return null;
            // Mock implementation
            return { ...prevCart };
          });
        }, 500);
        return { success: true };
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError("فشل في إزالة المنتج من السلة");
      return { success: false, error: "فشل في إزالة المنتج من السلة" };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (import.meta.env.VITE_TEMPO !== "true") {
        await cartService.clearCart();
        setCart(null);
        return { success: true };
      } else {
        // Mock clearing cart for Tempo environment
        setTimeout(() => {
          setCart(null);
        }, 500);
        return { success: true };
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("فشل في تفريغ السلة");
      return { success: false, error: "فشل في تفريغ السلة" };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchCart();
    }
  }, [fetchCart]);

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
};
