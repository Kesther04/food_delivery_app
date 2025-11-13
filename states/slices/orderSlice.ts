// orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  dishId: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "preparing" | "on the way" | "delivered" | "cancelled";
  contactDetails: string;
  deliveryAddress: string;
  paymentMethod: "credit card" | "cash on delivery";
  createdAt?: string;
  updatedAt?: string;
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
