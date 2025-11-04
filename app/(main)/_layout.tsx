import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import TabHeader from "@/components/header";

export default function MainTabLayout() {
  const { auth, loading } = useAuthContext();

  if (loading) {
    return null; // or splash/loader
  }

  if (!auth) {
    // redirect to auth stack
    return <Redirect href="../(auth)/(tab)/signin" />;
  }

  return (
    <>
      {/* Static header above all tabs */}
      <TabHeader />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "darkred",
          tabBarInactiveTintColor: "gray",
          headerShown: false, // disable per-tab header
          tabBarStyle: { height: 60, paddingBottom: 5 },
          animation: "shift",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color }) => (
              <Ionicons name="receipt-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
