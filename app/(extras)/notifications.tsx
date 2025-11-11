import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Example mock notifications (replace with API call if available)
const mockNotifications = [
  { id: "1", title: "Order Delivered", message: "Your order #1234 has been delivered.", read: false },
  { id: "2", title: "New Promo", message: "Get 20% off on all meals today!", read: false },
  { id: "3", title: "Order Confirmed", message: "Your order #1235 has been confirmed.", read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="notifications-outline" size={64} color="gray" />
        <Text style={styles.emptyText}>No notifications yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, item.read ? styles.read : styles.unread]}
            onPress={() => toggleRead(item.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={item.read ? "checkmark-done-outline" : "notifications-outline"}
                size={24}
                color={item.read ? "green" : "darkred"}
                style={{ marginRight: 12 }}
              />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  emptyText: { marginTop: 10, fontSize: 16, color: "gray" },
  container: { flex: 1, backgroundColor: "#fff" },
  notificationCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  unread: { borderLeftWidth: 4, borderLeftColor: "darkred" },
  read: { opacity: 0.6 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  message: { fontSize: 14, color: "#555", marginTop: 4 },
});
