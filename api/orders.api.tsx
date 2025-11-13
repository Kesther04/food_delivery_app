import { Order } from "@/states/slices/orderSlice";
import apiClient from "./client"

// api handler for creating order
export const createOrder = async (orderData:Order) => {
    const response = await apiClient.post("/orders",orderData);
    return response.data;
}

// api handler for getting specific user orders
export const allUserOrders = async () => {
    const response = await apiClient.get("/orders");
    return response.data;

}

// api handler for getting specific order
export const getOrder = async (id:string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
}