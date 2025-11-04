import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
// import { useUserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
// import { users } from "@/data/users";
import { signin } from "@/api/auth.api";
import { useAuthContext } from "@/context/AuthContext";

// Validation schema with Yup
const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too short").required("Password is required"),
});

export default function SignIn() {
  const styles = createStyles();
  const [visible,setVisible] = useState(false);
  // const { setUser, user } = useUserContext();
  const { setToken, auth } = useAuthContext();
  const router = useRouter();

  // if (loading) return <ActivityIndicator size="large"/>
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom:20, fontWeight: 500}}>Sign In</Text>
      <Text style={{ marginBottom: 20, color: "gray" }}>Welcome back! Please enter your details.</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={(values) => {
          const fetchUser = async () => {
            try {
              // Call the API
              const response = await signin(values.email, values.password);

              // Validate API response
              if (!response || !response.token) {
                console.warn("Invalid login response:", response);
                return alert("Login failed. Please try again.");
              }

              // Save token (using AsyncStorage in AuthContext)
              setToken(response.token);

              console.log("Login successful:", response);

              // Redirect after authentication is successful
              router.push("/(main)");

            } catch (error: any) {
              console.error("Authentication Error:", error);

              // Gracefully handle different error formats
              const message =
                error?.response?.data?.message ||
                error?.message ||
                "An unexpected error occurred during login.";

              alert(message);

            } finally {
              console.log("Form submitted:", values);
            }
          };
          fetchUser();
              
          
        }}
      >
        {({
          handleChange,handleBlur,handleSubmit,
          values,errors,touched,
        }) => (
          <View>
            {/* enter email */}
            <View style={{ marginBottom: 5}}>
              <TextInput
                placeholder="Enter Email.."
                placeholderTextColor={"gray"}
                style={(errors.email && touched.email) ? [styles.input, styles.errInput] : styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>

            {/* enter password */}
            <View style={{ marginBottom: 5 }}>
              <TextInput
                placeholder="Enter Password.."
                placeholderTextColor={"gray"}
                style={(errors.password && touched.password) ? [styles.input, styles.errInput] : styles.input}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                
                secureTextEntry={!visible}
              />
                <TouchableOpacity onPress={() => setVisible(v => !v)} style={{ padding: 8 , position:"absolute", right: 0, top:3}}>
                    <Ionicons name={visible ? "eye" : "eye-off"} size={20} />
                </TouchableOpacity>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>

            {/* pressable button for submitting info */}
            <Pressable style={styles.btn} onPress={() => handleSubmit()}>
              <Text style={{ color: "white" }}>Submit</Text>
            </Pressable>
          </View>
        )}
      </Formik>
      
      <TouchableOpacity onPress={() => router.push("/(auth)/forgotpassword")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "blue" }}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function createStyles() {
  return StyleSheet.create({
    container:{
      flex: 1, padding: 10, backgroundColor:"white", fontFamily: "Inter_400Regular"
    },
    input: {
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    errInput:{
        borderColor:"darkred"
    },
    btn: {
      padding: 12,
      backgroundColor: "darkred",
      alignItems: "center",
      borderRadius: 5,
      marginTop: 20,
    },
    error: {
      color: "red",
      fontSize: 12,
      marginTop: 4,
    },
  });
}
