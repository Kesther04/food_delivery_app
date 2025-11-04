import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getDish } from "@/api/dish.api";
import { userProfile } from "@/api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { fetchCart,addOrUpdateCart,deleteCartItem } from "@/states/actions/cartAction";
import { toggleFavorite } from "@/states/actions/favoritesAction";
import { setFavorites } from "@/states/slices/favoritesSlice";

interface DishProp {
  _id: string;
  name: string;
  imageUrl: string;
  restaurantName: string;
  price: number;
  rating: number;
  reviewCount: number;
  address: string;
  description: string;
  category: string;
}

export default function DishScreen() {
  const { id } = useLocalSearchParams();
  // const router = useRouter();
  
  const [dish, setDish] = useState<DishProp | null>(null);
  const [loading, setLoading] = useState(true);

  const cart = useSelector((state: RootState) => state.cart.items);
  const existingItem = cart.find((item) => item.dishId === id);
  const [cartCount, setCartCount] = useState(existingItem?.quantity || 0);

  const favorites = useSelector((state:RootState) => state.favorites);
  const dispatch = useDispatch<AppDispatch>();

  // 🧩 Fetch dish + user favorites + cart
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dishData, profileData] = await Promise.all([
          getDish(id as string),
          userProfile(),
        ]);

        setDish(dishData);
        dispatch(setFavorites(profileData.favorites));
        setLoading(false);

        // fetch cart once if not yet loaded
        dispatch(fetchCart());
      } catch (error) {
        console.error("Error fetching dish or profile:", error);
      }
    };
    if (id) loadData();
  }, [id]);

  // 🩵 Keep local count synced when redux updates
  useEffect(() => {
    if (existingItem) setCartCount(existingItem.quantity);
    else setCartCount(0);
  }, [existingItem]);

  // 🛒 Handle cart updates (triggered manually)
  const handleCartChange = async (newCount: number) => {
    if (!dish) return;
    setCartCount(newCount);

    if (newCount <= 0) {
      if (existingItem) dispatch(deleteCartItem(dish._id));
      return;
    }

    const item = {
      dishId: dish._id,
      price: dish.price,
      quantity: newCount,
    };

    dispatch(addOrUpdateCart(item));
  };

  // 💰 Total cart value
  const totalCartAmt = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const styles = createStyles();

  if (loading || !dish) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.foodHeader}>{dish.name}</Text>

        <View>
          <Image source={{ uri: dish.imageUrl }} style={styles.foodImg} />
          <Ionicons
            name={favorites.includes(dish._id) ? "heart" : "heart-outline"}
            size={30}
            color={favorites.includes(dish._id) ? "red" : "white"}
            style={styles.heart}
            onPress={() => dispatch(toggleFavorite(dish._id))}
          />
        </View>

        <View style={styles.infoRow}>
          <View style={{ flexDirection: "column", gap: 5 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Text>₦{dish.price}</Text>
              <Text>
                <Ionicons name="star" size={10} color="gold" /> {dish.rating}
              </Text>
            </View>

            <Text>
              <Ionicons name="restaurant" size={12} color="black" /> {dish.restaurantName}
            </Text>
            <Text>
              <Ionicons name="location" size={12} color="black" /> {dish.address}
            </Text>
          </View>

          <View style={styles.cartQuantity}>
            <Text
              style={styles.cartBtns}
              onPress={() => handleCartChange(Math.max(0, cartCount - 1))}
            >
              -
            </Text>

            <Text style={{ color: "black", fontSize: 20, flexDirection: "row" }}>{cartCount}</Text>

            <Text
              style={styles.cartBtns}
              onPress={() => handleCartChange(cartCount + 1)}
            >
              +
            </Text>
          </View>
        </View>

        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Description</Text>
          <Text style={styles.foodDesc}>{dish.description}</Text>
        </View>
      </View>

      <View style={styles.cartCalc}>
        <Text>Total: ₦{totalCartAmt}</Text>

        <Pressable
          style={styles.addToCart}
          onPress={() => handleCartChange(cartCount + 1)}
        >
          <Text style={{ color: "white" }}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles() {
  return StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: "white",
    },
    foodHeader: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
    },
    foodImg: {
      width: "100%",
      height: 200,
      borderRadius: 10,
    },
    foodDesc: {
      padding: 3,
    },
    heart: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    addToCart: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: "darkred",
      borderRadius: 5,
      flexDirection: "row",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    cartQuantity: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderColor: "darkred",
      borderWidth: 1,
      borderRadius: 5,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    cartBtns: {
      color: "white",
      paddingHorizontal: 8,
      paddingVertical: 2,
      fontSize: 20,
      backgroundColor: "darkred",
      borderRadius: 5,
      textAlign: "center",
      minWidth: 30,
      height: 30,
    },
    cartCalc: {
      position: "absolute",
      bottom: 0,
      left: 0,
      padding: 20,
      width: "100%",
      backgroundColor: "white",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 0.25,
      borderColor: "lightgray",
    },
  });
}
