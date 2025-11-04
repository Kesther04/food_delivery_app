// src/states/actions/cartActions.ts
import { AppDispatch } from "../store";
import { CartItem, setCart } from "../slices/cartSlice";
import * as cartApi from "@/api/cart.api";


// 🧩 Fetch entire cart
export const fetchCart = () => async (dispatch: AppDispatch) => {
  try {
    const data = await cartApi.getCart();
    dispatch(setCart(data.items));
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  }
};

// 🧠 Add or update item
export const addOrUpdateCart = (item: CartItem) => async (dispatch: AppDispatch) => {
    try {
      const data = await cartApi.makeOrAlterCart(item);
      dispatch(setCart(data.items));
    } catch (error) {
      console.error("Error altering cart item:", error);
    }
  };

// 🗑 Remove specific item
export const deleteCartItem = (dishId: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await cartApi.removeCartItem(dishId);
    dispatch(setCart(data.items));
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

// 🔥 Clear all
export const clearUserCart = () => async (dispatch: AppDispatch) => {
  try {
    const data = await cartApi.clearCart();
    dispatch(setCart(data.items));
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};
