import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { IProduct } from "../types/product";
import { supabase } from "../lib/supabase";

interface CartItem extends IProduct {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const trackAddToCart = async (productId: number) => {
    const { error } = await supabase.rpc(
      "increment_product_add_to_cart",
      {
        product_id_input: productId,
      }
    );

    if (error) {
      console.log(
        "ADD TO CART TRACKING ERROR:",
        error
      );
    }
  };

  const addToCart = (product: IProduct) => {
    // Product out of stock হলে add করা যাবে না
    if (product.stock <= 0) {
      return;
    }

    let canAdd = false;

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      // Product already cart-এ থাকলে
      if (existingProduct) {
        // Stock limit reached হলে আর quantity বাড়বে না
        if (existingProduct.quantity >= product.stock) {
          return currentCart;
        }

        canAdd = true;

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // নতুন product cart-এ add
      canAdd = true;

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    // Cart-এ successfully add হলে tracking
    if (canAdd) {
      trackAddToCart(product.id);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const increaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        // Stock-এর বেশি quantity নেওয়া যাবে না
        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};