import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/states/store";
import { fetchCart, deleteCartItem, clearUserCart } from "@/states/actions/cartAction";
import { getDish } from "@/api/dish.api";
import { router } from "expo-router";

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const items  = useSelector((state: RootState) => state.cart.items);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [dishDetails, setDishDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

   // Fetch dish details for each item
  useEffect(() => {
    const fetchDishDetails = async () => {
      const details: { [key: string]: any } = {};
      for (const item of items) {
        const dish = await getDish(item.dishId);
        details[item.dishId] = dish;
      }
      setDishDetails(details);
    };

    if (items.length > 0) {
      fetchDishDetails();
    }
  }, [items]);

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => dispatch(clearUserCart()) },
    ]);
  };

  const renderItem = ({ item }: any) => (
      <View style={styles.itemContainer}>
        
        <View>
          <Image source={{ uri: dishDetails[item.dishId]?.imageUrl }} style={styles.dishImage} />
          <Text style={styles.dishName}>{          dishDetails[item.dishId] ? dishDetails[item.dishId].name : "Loading..."}</Text>
          <Text style={styles.detail}>Quantity: {item.quantity}</Text>
          <Text style={styles.detail}>Price: ₦{item.price.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => dispatch(deleteCartItem(item.dishId))}
        >
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Your Cart</Text> */}

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
          <Text style={styles.subText}>Add some delicious dishes to continue!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.dishId}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.row}>
              <Text style={styles.summaryText}>Total Items:</Text>
              <Text style={styles.summaryText}>{items.length}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Price:</Text>
              <Text style={styles.totalValue}>₦{totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={handleClearCart}>
                <Text style={[styles.btnText, {color:"#fff"}]}>Clear Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.checkoutBtn]} onPress={()=>router.push("./checkout_flow")}>
                <Text style={[styles.btnText, {color:"darkred"}]}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 12, color: "#111" },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    borderWidth: 0,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dishName: { fontSize: 16, fontWeight: "500", color: "#333" },
  dishImage: { width: 80, height: 80, borderRadius: 8, marginBottom: 8 },
  detail: { fontSize: 14, color: "black", marginTop: 2 },
  deleteBtn: {
    backgroundColor: "darkred",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", fontWeight: "500" },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryText: { fontSize: 15, color: "#333" },
  totalLabel: { fontSize: 17, fontWeight: "600" },
  totalValue: { fontSize: 17, fontWeight: "700", color: "black" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  clearBtn: { backgroundColor:"darkred", marginRight: 8 },
  checkoutBtn: { borderWidth:1, borderColor:"gray" },
  btnText: { fontWeight: "600" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#777", marginBottom: 4 },
  subText: { fontSize: 14, color: "#999" },
});
