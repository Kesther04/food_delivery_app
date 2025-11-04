import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/states/store";
import { allDishes } from "@/api/dish.api";
import { toggleFavorite } from "@/states/actions/favoritesAction";

export default function Favorites() {
  const styles = createStyles();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites);
  const [dishData, setDishData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dishes = await allDishes();
      setDishData(dishes);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load dishes whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const favoriteDishes = dishData.filter((dish) => favorites.includes(dish._id));

  const goToDish = (id: string) => {
    router.push(`/dish/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  if (favoriteDishes.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={48} color="gray" />
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.subText}>Add dishes to your favorites from your menu</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["left", "right", "bottom"]}>
      <FlatList
        data={favoriteDishes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.itemContainer} onPress={() => goToDish(item._id)}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.restaurant}>{item.restaurantName}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₦{item.price}</Text>
                <Text style={styles.rating}>
                  <Ionicons name="star" size={12} color="gold" /> {item.rating}
                </Text>
              </View>
            </View>

            <Ionicons
              name={favorites.includes(item._id) ? "heart" : "heart-outline"}
              size={24}
              color={favorites.includes(item._id) ? "red" : "gray"}
              style={styles.heartIcon}
              onPress={() => dispatch(toggleFavorite(item._id))}
            />
          </Pressable>
        )}
      />
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
    header: {
      fontSize: 20,
      fontWeight: "600",
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: "darkred",
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      marginBottom: 12,
      borderRadius: 10,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 1,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 8,
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: "#222",
    },
    restaurant: {
      fontSize: 13,
      color: "#666",
      marginVertical: 2,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    price: {
      fontWeight: "600",
      color: "black",
    },
    rating: {
      fontSize: 13,
      color: "#555",
    },
    heartIcon: {
      marginLeft: 10,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      padding: 20,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#555",
      marginTop: 10,
    },
    subText: {
      fontSize: 14,
      color: "#888",
      marginTop: 4,
      textAlign: "center",
      paddingHorizontal: 30,
    },
  });
}
