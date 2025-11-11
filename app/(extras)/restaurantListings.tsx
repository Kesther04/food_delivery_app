import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { allRestaurants } from "@/api/restaurant.api";

export default function RestaurantsScreen() {
  const styles = createStyles();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await allRestaurants();
      setRestaurants(res);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Refresh when screen refocuses
  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [])
  );

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const goToRestaurant = (id: string) => {
    router.push(`../menu/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={!isFocused ? styles.searchInput : [styles.searchInput, { outline: "none" }]}
          placeholder="Search for restaurants..."
          placeholderTextColor={"gray"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={setQuery}
          value={query}
        />
        <Ionicons
          name="search"
          size={24}
          color={"black"}
          style={styles.searchIcon}
          onPress={() => alert(`Searched for ${query}`)}
        />
      </View>

      {/* Restaurants List */}
      <Animated.FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredRestaurants}
        keyExtractor={(item) => item._id}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => goToRestaurant(item._id)}
          >

            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.infoRow}>
                <Text style={styles.address}>
                  <Ionicons name="location" size={14} color="black" />{" "}
                  {item.address}
                </Text>

                <Text>
                  <Ionicons name="arrow-forward" size={16} />
                </Text>
                {/* <Text style={styles.rating}>
                  <Ionicons name="star" size={14} color="gold" /> {item.rating} ({item.reviewCount})
                </Text> */}
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

// STYLES
function createStyles() {
  return StyleSheet.create({
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
    searchBar: {
      paddingVertical: 4,
      paddingHorizontal: 2,
      flexDirection: "column",
      margin: 10,
    },
    searchInput: {
      padding: 10,
      paddingLeft: 50,
      fontSize: 15,
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 1,
      color: "black",
    },
    searchIcon: {
      position: "absolute",
      left: 15,
      top: 12,
    },
    listContainer: {
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    cardHeader: {
      width: "100%",
      height: 160,
      backgroundColor: "#f2f2f2",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    cardBody: {
      padding: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      color:"darkred"
    },
    desc: {
      color: "gray",
      fontSize: 13,
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    address: {
      fontSize: 12,
      color: "black",
    },
    rating: {
      fontSize: 12,
      color: "gray",
    },
  });
}
