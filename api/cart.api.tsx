import { CartItem } from "@/states/slices/cartSlice";
import apiClient from "./client";

// api handler for getting cart details
export const getCart = async () => {
    const response = await apiClient.get("/cart");
    return response.data;
}

// api handler for adding or updating cart items
export const makeOrAlterCart = async (item: CartItem) => {
    const response = await apiClient.post("/cart", item);
    return response.data;
}

// api handler for clearing the cart
export const clearCart = async () => {
    const response = await apiClient.delete("/cart");
    return response.data;
}

// api handler for removing a specific item from the cart
export const removeCartItem = async (dishId: string) => {
    const response = await apiClient.delete(`/cart/${dishId}`);
    return response.data;
}