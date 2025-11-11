import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { RestaurauntMenu } from "@/api/restaurant.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { toggleFavorite } from "@/states/actions/favoritesAction";
import { setFavorites } from "@/states/slices/favoritesSlice";
import { userProfile } from "@/api/user.api";

export default function MenuScreen() {
  const { id } = useLocalSearchParams(); // restaurant id
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites);

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [focusedDish, setFocusedDish] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await RestaurauntMenu(id as string);
      const user = await userProfile();
      setRestaurant(data);
      dispatch(setFavorites(user.favorites || []));
    } catch (error) {
      console.error("Error fetching restaurant menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMenu();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loader}>
        <Text>No restaurant data found.</Text>
      </View>
    );
  }

  // Navigate to dish detail
  const goToDish = (dishId: string) => {
    setFocusedDish(dishId === focusedDish ? null : dishId);
    router.push(`/dish/${dishId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Restaurant Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.desc}>{restaurant.description}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            <Ionicons name="location" size={14} color="black" /> {restaurant.address}
          </Text>
          <Text style={styles.infoText}>
            <Ionicons name="star" size={14} color="gold" /> {restaurant.rating} ({restaurant.reviewCount})
          </Text>
        </View>
      </View>

      {/* Menu List */}
      <Animated.FlatList
        contentContainerStyle={styles.menuList}
        data={restaurant.dishes}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={{ overflow: "hidden", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              onPress={() => goToDish(item._id)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={
                  focusedDish === item._id
                    ? [styles.image, { transform: [{ scale: 1.1 }] }]
                    : styles.image
                }
              />
            </Pressable>

            {/* Favorite icon */}
            <Ionicons
              name={favorites.includes(item._id) ? "heart" : "heart-outline"}
              size={22}
              color={favorites.includes(item._id) ? "red" : "white"}
              style={styles.heart}
              onPress={() => dispatch(toggleFavorite(item._id))}
            />

            <View style={styles.textContainer}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishPrice}>₦{item.price}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="gold" />
                <Text style={{ marginLeft: 4 }}>{item.rating ?? restaurant.rating}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "darkred",
  },
  desc: {
    fontSize: 14,
    color: "gray",
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    color: "black",
    fontSize: 13,
  },
  menuList: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    transitionDuration: "400ms",
    transform: [{ scale: 1 }],
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  textContainer: {
    padding: 10,
  },
  dishName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#000",
  },
  dishPrice: {
    fontSize: 14,
    color: "darkred",
    marginVertical: 4,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
