import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpSupportScreen() {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Empty Field", "Please type your message before submitting.");
      return;
    }
    Alert.alert("Message Sent ✅", "Our support team will reach out soon!");
    setMessage("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>
        Need help? We’ve got you covered. You can check the FAQs or reach out directly.
      </Text>

      {/* Quick Help Sections */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="help-circle-outline" size={24} color="darkred" />
          <Text style={styles.optionText}>FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="chatbubble-outline" size={24} color="darkred" />
          <Text style={styles.optionText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="warning-outline" size={24} color="darkred" />
          <Text style={styles.optionText}>Report an Issue</Text>
        </TouchableOpacity>
      </View>

      {/* Message Input */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Send us a message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here..."
          style={styles.input}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  form: {
    marginTop: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "darkred",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
