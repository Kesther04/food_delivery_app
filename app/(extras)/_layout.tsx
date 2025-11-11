import { Stack } from "expo-router";

export default function ExtrasLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, animation: "slide_from_right" }}>
      <Stack.Screen
        name="restaurantListings"
        options={{
          title: "Restaurants", // ✅ Changes header title
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "App Settings",
        }}
      />
      <Stack.Screen
        name="helpAndSupport"
        options={{
          title: "Help & Support",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
}
