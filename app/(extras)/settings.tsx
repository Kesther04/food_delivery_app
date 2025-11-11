import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userProfile } from "@/api/user.api";
import { useAuthContext } from "@/context/AuthContext";

export default function Settings() {
  const { logout } = useAuthContext();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userProfile();
      setUser({ name: data.name, email: data.email });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      Alert.alert("Error", "Failed to load user profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle" size={60} color="darkred" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{user?.name ?? "Unknown"}</Text>
          <Text style={styles.email}>{user?.email ?? "No email"}</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.option}>
          <Text style={styles.optionText}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            trackColor={{ false: "#ccc", true: "lightcoral" }}
            thumbColor={notificationsEnabled ? "darkred" : "#f4f3f4"}
          />
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={() => setDarkMode(!darkMode)}
            trackColor={{ false: "#ccc", true: "lightcoral" }}
            thumbColor={darkMode ? "darkred" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="create-outline" size={22} color="darkred" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <Ionicons name="lock-closed-outline" size={22} color="darkred" />
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  container: { padding: 20, backgroundColor: "#fff" },
  profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  name: { fontSize: 18, fontWeight: "600", color: "#333" },
  email: { fontSize: 14, color: "#777" },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#555", marginBottom: 10 },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: 16, color: "#333" },
  action: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  actionText: { fontSize: 16, marginLeft: 10, color: "#333" },
});
