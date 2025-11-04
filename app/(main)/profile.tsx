import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useFocusEffect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { toggleFavorite } from "@/states/actions/favoritesAction";
import { setFavorites } from "@/states/slices/favoritesSlice";
import { userProfile } from "@/api/user.api";
import { allDishes } from "@/api/dish.api";
import { useAuthContext } from "@/context/AuthContext";

export default function Profile() {
  const router = useRouter();
  const styles = createStyles();
  const { logout } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.favorites);
  const [user, setUser] = useState<any>(null);
  const [favDishes, setFavDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userData, dishes] = await Promise.all([userProfile(), allDishes()]);
      setUser(userData);
      dispatch(setFavorites(userData.favorites || []));

      // Map favorites to actual dish data
      const favItems = dishes.filter((dish: any) =>
        userData.favorites?.includes(dish._id)
      );
      setFavDishes(favItems);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="person-circle-outline" size={64} color="gray" />
        <Text style={styles.emptyText}>Unable to load profile</Text>
        <Pressable style={styles.retryBtn} onPress={fetchProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* USER INFO */}
        <View style={styles.header}>
          <Ionicons name="person-circle" size={90} color="darkred" />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role?.toUpperCase()}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="darkred" />
            <Text style={styles.infoText}>{user.email || "No email"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="darkred" />
            <Text style={styles.infoText}>{user.phone || "No phone number"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="darkred" />
            <Text style={styles.infoText}>{user.address || "No address"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={20} color="darkred" />
            <Text style={styles.infoText}>
              {user.favorites?.length || 0} Favorite Dishes
            </Text>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable
          style={styles.logoutBtn}
          onPress={() => logout()}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles() {
  return StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: "gray",
    },
    retryBtn: {
      marginTop: 15,
      backgroundColor: "darkred",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    retryText: {
      color: "#fff",
      fontWeight: "600",
    },
    container: { flex: 1, backgroundColor: "#fff" },
    header: { alignItems: "center", marginBottom: 30 },
    name: { fontSize: 22, fontWeight: "600", marginTop: 10, color: "#222" },
    role: { fontSize: 14, color: "#888", marginTop: 4 },
    infoBox: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      marginBottom: 25,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoText: { marginLeft: 10, fontSize: 15, color: "#333" },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#111",
      marginBottom: 12,
    },
    emptyFavorites: {
      textAlign: "center",
      color: "gray",
      fontSize: 15,
      marginBottom: 20,
    },
    favList: { paddingBottom: 20 },
    foodItem: {
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 12,
      maxWidth: "50%",
      flex: 1,
      marginHorizontal: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    foodImg: {
      width: "100%",
      height: 100,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    foodText: { padding: 10 },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
      alignItems: "center",
    },
    foodPrice: { fontWeight: "600" },
    heart: { position: "absolute", top: 10, right: 10 },
    logoutBtn: {
      backgroundColor: "darkred",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      paddingVertical: 12,
      marginTop: 30,
      gap: 6,
    },
    logoutText: { color: "#fff", fontWeight: "600" },
  });
}
