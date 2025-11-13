import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { getDish } from "@/api/dish.api";
import { createOrder } from "@/states/actions/orderAction";
import { Order } from "@/states/slices/orderSlice";
import { clearCart } from "@/api/cart.api";
import { clearUserCart } from "@/states/actions/cartAction";

export default function CheckoutFlow() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<number>(0);

  const items = useSelector((state: RootState) => state.cart.items);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );
  const deliveryFee = subtotal > 3000 ? 200 : 300;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  // Form states
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "credit card" | "cash on delivery"
  >("credit card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const [dishDetails, setDishDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchDishDetails = async () => {
      const details: { [key: string]: any } = {};
      for (const item of items) {
        const dish = await getDish(item.dishId);
        details[item.dishId] = dish;
      }
      setDishDetails(details);
    };
    if (items.length > 0) fetchDishDetails();
  }, [items]);

  const validateDeliverTo = () => {
    if (!phone.trim()) return Alert.alert("Please enter your delivery contact.");
    if (!address.trim()) return Alert.alert("Please enter delivery address.");
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === "credit card") {
      if (!cardNumber.trim() || cardNumber.length < 12)
        return Alert.alert("Enter valid card number.");
      if (!cardName.trim()) return Alert.alert("Enter cardholder name.");
      if (!cardExpiry.trim()) return Alert.alert("Enter expiry date.");
      if (!cardCvv.trim() || cardCvv.length < 3)
        return Alert.alert("Enter valid CVV.");
    }
    return true;
  };

  const goNext = () => {
    if (step === 0 && !validateDeliverTo()) return;
    if (step === 2 && !validatePayment()) return;
    if (step < 2) setStep((prev) => prev + 1);
    else submitOrder();
  };

  const goBack = () => {
    if (step === 0) router.back();
    else setStep((s) => s - 1);
  };

  const submitOrder = async () => {
    try {
      setProcessing(true);

      const orderData: Omit<Order, "userId"> = {
        items: items.map((it) => ({
          dishId: it.dishId,
          price: it.price,
          quantity: it.quantity,
        })),
        totalAmount: total,
        status: "pending",
        contactDetails: phone,
        deliveryAddress: address,
        paymentMethod,
      };

      await dispatch(createOrder(orderData));
      await dispatch(clearUserCart());

      setProcessing(false);
      Alert.alert(
        "Order Confirmed",
        `Your order was placed successfully!\nTotal: ₦${total}`,
        [
          { text: "View Orders", onPress: () => router.push("../(main)/orders") },
          { text: "OK", onPress: () => router.back() },
        ]
      );
    } catch (error) {
      setProcessing(false);
      Alert.alert("Error", "Failed to place order. Try again later.");
    }
  };

  const progressWidth = (step / 2) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        <StepIndicator index={0} label="Deliver to" activeIndex={step} />
        <StepIndicator index={1} label="Summary" activeIndex={step} />
        <StepIndicator index={2} label="Payment" activeIndex={step} />
      </View>

      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[styles.progressBarFill, { width: `${progressWidth}%` }]}
        />
      </View>

      {/* Steps */}
      <View style={styles.content}>
        {step === 0 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Text style={styles.stepTitle}>Deliver To</Text>
            <Field label="Delivery Contact" value={phone} setValue={setPhone} />
            <Field
              label="Delivery Address"
              value={address}
              setValue={setAddress}
              multiline
              height={80}
              placeholder="e.g. 12 Awolowo Road, Lekki"
            />
            <Field
              label="Instructions (optional)"
              value={instructions}
              setValue={setInstructions}
            />
          </ScrollView>
        )}

        {step === 1 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Text style={styles.stepTitle}>Order Summary</Text>
            {items.map((it) => (
              <View key={it.dishId} style={styles.summaryRow}>
                <View>
                  <Text style={styles.itemName}>
                    {dishDetails[it.dishId]?.name || "Loading..."}
                  </Text>
                  <Text style={styles.itemMeta}>qty: {it.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₦{it.price * it.quantity}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Delivery Fee" value={deliveryFee} />
            <SummaryRow label="Tax (5%)" value={tax} />
            <View style={styles.divider} />
            <SummaryRow label="Total" value={total} bold />
          </ScrollView>
        )}

        {step === 2 && (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Text style={styles.stepTitle}>Payment</Text>
            <View style={styles.paymentMethods}>
              {["credit card", "cash on delivery"].map((method) => (
                <Pressable
                  key={method}
                  onPress={() =>
                    setPaymentMethod(method as "credit card" | "cash on delivery")
                  }
                  style={[
                    styles.payMethod,
                    paymentMethod === method && styles.payMethodActive,
                  ]}
                >
                  <Ionicons
                    name={
                      method === "credit card"
                        ? "card-outline"
                        : "cash-outline"
                    }
                    size={20}
                    color={paymentMethod === method ? "white" : "darkred"}
                  />
                  <Text
                    style={[
                      styles.payMethodText,
                      paymentMethod === method && { color: "white" },
                    ]}
                  >
                    {method === "credit card" ? "Card" : "Cash on Delivery"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {paymentMethod === "credit card" && (
              <>
                <Field label="Card Number" value={cardNumber} setValue={setCardNumber} />
                <Field label="Cardholder Name" value={cardName} setValue={setCardName} />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Field label="Expiry Date" value={cardExpiry} setValue={setCardExpiry} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="CVV" value={cardCvv} setValue={setCardCvv} />
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={goBack} style={[styles.footerBtn, styles.ghostBtn]}>
          <Text style={styles.ghostText}>{step === 0 ? "Cancel" : "Back"}</Text>
        </Pressable>
        <Pressable
          onPress={goNext}
          style={[styles.footerBtn, styles.primaryBtn]}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryText}>
              {step === 2 ? "Place Order" : "Next"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/** Helper Components **/
function StepIndicator({ index, label, activeIndex }: any) {
  const active = index === activeIndex;
  const done = index < activeIndex;
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 18,
          backgroundColor: done || active ? "darkred" : "#fff",
          borderWidth: done || active ? 0 : 1,
          borderColor: "#ccc",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: done || active ? "white" : "black", fontWeight: "600" }}>
          {done ? "✓" : index + 1}
        </Text>
      </View>
      <Text style={{ marginTop: 6, fontSize: 12, color: "#444" }}>{label}</Text>
    </View>
  );
}

function Field({ label, value, setValue, ...props }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: "#333", fontWeight: "500" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        style={{
          borderWidth: 1,
          borderColor: "#e6e6e6",
          borderRadius: 8,
          padding: 10,
          backgroundColor: "#fff",
          height: props.height || 45,
        }}
        {...props}
      />
    </View>
  );
}

function SummaryRow({ label, value, bold = false }: any) {
  return (
    <View style={styles.summaryRow}>
      <Text style={bold ? styles.totalLabel : undefined}>{label}</Text>
      <Text style={bold ? styles.totalValue : undefined}>₦{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#222" },
  stepper: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 10 },
  progressBarBackground: { height: 4, backgroundColor: "#eee", marginHorizontal: 16, borderRadius: 2, marginTop: 10 },
  progressBarFill: { height: "100%", backgroundColor: "darkred" },
  content: { flex: 1 },
  stepContainer: { padding: 16, paddingBottom: 120 },
  stepTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "darkred" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  itemName: { fontWeight: "600" },
  itemMeta: { color: "gray", fontSize: 12 },
  itemPrice: { fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
  paymentMethods: { flexDirection: "row", gap: 8, marginBottom: 12 },
  payMethod: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
  payMethodActive: { backgroundColor: "darkred", borderColor: "darkred" },
  payMethodText: { marginLeft: 8, color: "darkred", fontWeight: "600" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, flexDirection: "row", justifyContent: "space-between", backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#eee" },
  footerBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", marginHorizontal: 6 },
  ghostBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  ghostText: { color: "darkred", fontWeight: "600" },
  primaryBtn: { backgroundColor: "darkred" },
  primaryText: { color: "white", fontWeight: "700" },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 18, color: "darkred", fontWeight: "bold" },
});
