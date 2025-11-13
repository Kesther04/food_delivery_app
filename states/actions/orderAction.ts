import { AppDispatch } from "../store";
import { setOrders } from "../slices/orderSlice";
import * as orderApi from "@/api/orders.api";
import { Order } from "../slices/orderSlice";

// 🧩 Fetch all user orders
export const fetchOrders = () => async (dispatch: AppDispatch) => {
  try {
    const data = await orderApi.allUserOrders();
    dispatch(setOrders(data)); // backend returns full list of user's orders
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
  }
};

// 🧠 Create new order
export const createOrder = (orderData: Order) => async (dispatch: AppDispatch) => {
  try {
    const data = await orderApi.createOrder(orderData);
    // assume backend returns updated orders array
    dispatch(setOrders([data]));
  } catch (error) {
    console.error("❌ Error creating order:", error);
  }
};
