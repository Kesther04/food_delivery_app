// import { useUserContext } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartIcon from "./cartIcon";
import { useAuthContext } from "@/context/AuthContext";

export default function TabHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropDownValue, setDropDownValue] = useState<string | null>(null);
  const dropDownItems = ["Restauraunt Listings", "Notifications", "Help & Support", "Settings", "Logout"];
  const styles = createStyles();
  // const { logout } = useUserContext();
  const { logout } = useAuthContext();
  
  // animated value
  const slideAnim = useRef(new Animated.Value(-200)).current; // start hidden
  const [modalVisible, setModalVisible] = useState(false);

  // Open dropdown: show modal and slide down
  const showDropdown = () => {
    setModalVisible(true); // first make modal visible
    Animated.spring(slideAnim, {
      toValue: 20,
      useNativeDriver: true,
    }).start();
  };

  // Close dropdown: slide up first, then hide modal
   const hideDropdown = () => {
        // Slide up animation
        Animated.spring(slideAnim, {
            toValue: -200, // move it up
            useNativeDriver: true,
        }).start();

        // Delay hiding the modal so the animation completes
        setTimeout(() => {
            setModalVisible(false);
            setDropdownVisible(false);
            // Reset slideAnim to start hidden, so next open works
            slideAnim.setValue(-200);
        }, 300); // 300ms matches approximate spring duration
    };


  return (
    <SafeAreaView style={styles.container}>
        {/* Brand Logo */}
        <Text style={styles.title}>Savory<Text style={{ color: "darkred" }}>Swift</Text></Text>

        <View style={styles.iconContainer}>
          {/* Cart Icon */}
          <CartIcon />

          <View>
            {/* Button to toggle Menu */}
            <Pressable
              onPress={() => {
                setDropdownVisible(true);
                showDropdown();
              }}
            >
              <Ionicons name="ellipsis-vertical" size={28} color="black" />
            </Pressable>

            {/* Floating Menu */}
            <Modal visible={modalVisible} transparent animationType="none" onRequestClose={hideDropdown}>
              <Pressable style={styles.modalContainer} onPress={hideDropdown}>
                <Animated.View 
                    pointerEvents="box-none" 
                    style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                  {dropDownItems.map(item => (
                    <Pressable
                      key={item}
                      onPress={() => {
                        setDropDownValue(item);
                        hideDropdown();
                        if (item === "Logout") {
                          logout();
                        }
                      }}
                    >
                      <Text style={dropDownValue === item ? styles.modalItemSelected : styles.modalItem}>{item}</Text>
                    </Pressable>
                  ))}
                </Animated.View>
              </Pressable>
            </Modal>
          </View>
        </View>
    </SafeAreaView>
  );
}

const createStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#fff",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      
      // subtle, optimized shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      fontFamily: "Inter_400Regular"
    },

    title: {
      fontSize: 20,
      fontWeight: "bold",
      fontStyle:"italic"
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 15,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingRight: 10,
      paddingTop: 50,
    },
    modalContent: {
      backgroundColor: "white",
      padding: 12,
      borderRadius: 8,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      minWidth: 150,
    },
    modalItem: {
      paddingVertical: 10,
      fontSize: 16,
      color: "black",
    },
    modalItemSelected: {
      paddingVertical: 10,
      fontSize: 16,
      fontWeight: "bold",
      color: "darkred",
    },
  });
};
