import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Keyboard,
  View,
  Platform,
  LayoutAnimation,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function AuthTabLayout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        LayoutAnimation.easeInEaseOut(); // smooth transition
        setKeyboardVisible(true);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        LayoutAnimation.easeInEaseOut();
        setKeyboardVisible(false);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://thumbs.dreamstime.com/b/vibrant-food-splash-featuring-gourmet-dish-motion-high-speed-shot-capturing-essence-gourmet-cooking-bright-bold-328712916.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        style={[
          styles.tabContainer,
          { marginTop: isKeyboardVisible ? 100 : 300 }, // 👈 shrink margin when keyboard is open
        ]}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={0}
      >
        <TopTabs
          screenOptions={{
            tabBarActiveTintColor: "darkred",
            tabBarInactiveTintColor: "gray",
            tabBarIndicatorStyle: {
              backgroundColor: "darkred",
              height: 3,
            },
            tabBarLabelStyle: {
              fontSize: 16,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        >
          <TopTabs.Screen name="signin" options={{ title: "Sign In" }} />
          <TopTabs.Screen name="signup" options={{ title: "Sign Up" }} />
        </TopTabs>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});