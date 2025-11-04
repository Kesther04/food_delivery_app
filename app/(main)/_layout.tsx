  import { Redirect, Tabs } from "expo-router"
  import { Ionicons } from "@expo/vector-icons";
  import { Feather } from "@expo/vector-icons";
  // import { useUserContext } from "@/context/UserContext";
  import TabHeader from "@/components/header";
import { useAuthContext } from "@/context/AuthContext";
  
  export default function MainTabLayout() {
    // const { user, loading} = useUserContext();
    const { auth, loading } = useAuthContext();
    if (loading) {
      return null; // or splash screen / loader
    }

    if (!auth) {
      // Navigate user to (auth) stack if not logged in
      return <Redirect href="../(auth)/(tab)/signin" />;
    }


    // layout for the first in view tabs for the user when accessing the application after login
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "darkred",
          tabBarInactiveTintColor: "gray",
          header: () => <TabHeader />,
          headerShown: true,
          tabBarStyle: { height: 60, paddingBottom: 5 },
          animation:"shift"
        }}
      >
        <Tabs.Screen name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
          }}
        />
        <Tabs.Screen name="orders"
          options={{
              title: "Orders",
              tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={28} color={color} />,
          }}
        />
        <Tabs.Screen name="favorites"
          options={{
              title: "Favorites",
              tabBarIcon: ({color}) => <Ionicons name="heart-outline" size={28} color={color} />,
          }}
        />
        <Tabs.Screen name="profile"
          options={{
              title: "Profile",
              tabBarIcon: ({color}) => <Feather name="user" size={28} color={color} />,
          }}
        />
      </Tabs>
    );
  }