import "react-native-gesture-handler";
import "react-native-reanimated";

import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { UserProvider } from "@/context/UserContext";
import CartIcon from "../components/cartIcon";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  // representing the layouts for every screen in my application
  const router = useRouter();
  const styles = createStyles();
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{headerShadowVisible: false }}>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            <Stack.Screen name="(main)" options={{headerShown: false}} />
            <Stack.Screen name="(cart)" options={{headerShown: false}}/>
            <Stack.Screen name="dish/[id]" 
              options={{
                headerShown: true,
                header: () => (
                  <SafeAreaView style={styles.container}>
                    <Pressable style={{ marginBottom: 0 }} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable> 
                  
                    <CartIcon/>
                  </SafeAreaView>
                )
              }} 
            />
            <Stack.Screen name="+not-found" options={{headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function createStyles() {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation:5
    },
  });
}