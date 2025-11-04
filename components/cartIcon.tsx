import { fetchCart } from "@/states/actions/cartAction";
import { AppDispatch, RootState } from "@/states/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CartIcon() {
    const router = useRouter();
    const styles = createStyles();
    const cart = useSelector((state:RootState) => state.cart.items);
    const dispatch = useDispatch<AppDispatch>();
   
    useEffect(() => {
        // You can perform any side effects here when totalCartItems changes
        dispatch(fetchCart());
    }, [dispatch]);

    const totalCartItems = cart.reduce((total,item) => total + item.quantity, 0);
   
    
    return (
        <Pressable onPress={() => { router.push("/(cart)/cart"); }} >
            <Ionicons name="cart-outline" size={28} color="black" />
            {
                totalCartItems == 0 
                ? ""
                :
                <View style={styles.cartNum}>
                    <Text style={{color:"white",fontSize:10,fontWeight:"bold"}}>{totalCartItems > 99 ? "99+": totalCartItems}</Text>
                </View>
            }


        </Pressable>
    )
}

function createStyles() {
    return StyleSheet.create({
        cartNum:{
            position:"absolute",
            backgroundColor:"darkred",
            width:22,
            height:22,
            borderRadius:18,
            top:-4,
            right:-6,
            justifyContent:"center",
            alignItems:"center"
        }
    })
}