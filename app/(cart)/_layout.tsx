import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function cartLayout () {
    const router = useRouter();
    const styles = createStyles();
    return (
        <Stack screenOptions={{ headerShown: false, animation:"slide_from_right" }}>
            <Stack.Screen name="cart"
            options={{
                headerShown: true,
                header: () => (
                  <SafeAreaView style={styles.container}>
                    <Pressable style={{ marginBottom: 0 }} onPress={() => router.back()}>
                      <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable> 
                    <Text style={{fontSize:18,fontWeight:"bold"}}>Your Cart</Text>
                  </SafeAreaView>
                )
                }} 
            />   {/* nested cart screens */}
            <Stack.Screen name="checkout_flow" />
        </Stack>
    )
}


function createStyles() {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      gap:100,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation:5
    },
  });
}