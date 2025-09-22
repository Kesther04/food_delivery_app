import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function CartIcon() {
    return (
        <Pressable onPress={() => alert("Cart Pressed")}>
            <Ionicons name="cart-outline" size={28} color="black" />
        </Pressable>
    )
}