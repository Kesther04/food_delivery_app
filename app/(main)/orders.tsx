// src/app/orders.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { fetchOrders } from "@/states/actions/orderAction";

export default function OrdersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.order);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchOrders());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="darkred" />
          <Text style={{ marginTop: 10 }}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );    
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      {orders.length <= 0 ? (
        <View style={styles.center}>
          <Text>No Orders yet.</Text>
        </View>
      ) :  (
        <ScrollView contentContainerStyle={styles.list}>
          {orders.map((order, idx) => (
            <View key={idx} style={styles.orderCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.orderId}>#{order._id?.slice(-6)}</Text>
                <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.address}>{order.deliveryAddress}</Text>
              <Text style={styles.amount}>₦{order.totalAmount}</Text>
              <Text style={styles.meta}>
                {new Date(order.createdAt || "").toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "green";
    case "on the way": return "orange";
    case "cancelled": return "gray";
    default: return "darkred";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", color: "darkred", marginBottom: 16 },
  list: { paddingBottom: 80 },
  orderCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontWeight: "bold", color: "#222" },
  status: { fontWeight: "600", fontSize: 12 },
  address: { color: "#555", marginVertical: 4 },
  amount: { fontWeight: "700", fontSize: 16 },
  meta: { color: "#999", fontSize: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
