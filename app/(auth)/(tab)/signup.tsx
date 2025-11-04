// import { useUserContext } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from 'yup'; // for form validation
import { useAuthContext } from "@/context/AuthContext";
import { signup } from "@/api/auth.api";
// import { users } from "@/data/users";

// Validation schema with Yup
const SignUpSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too short, must be at least 3 characters").required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Too short").required("Password is required"),
});


export default function SignUp() {
    const styles = createStyles();
    const [visible, setVisible] = useState(false);
    // const { setUser, user } = useUserContext();
    const { setToken, auth} = useAuthContext();
    const router = useRouter();

    return (
      <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor:"white" }} >
        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight:500 }}>Sign Up</Text>
        <Text style={{ marginBottom: 20, color: "gray" }}>Please enter your details to create an account.</Text>
        <Formik   
          initialValues={{ name:"", email: "", password: "" }}
          validationSchema={SignUpSchema}
          onSubmit={(values) => {
            const fetchUser = async () => {
              try {
                // Call the API
                const response = await signup(values);

                // Validate API response
                if (!response || !response.token) {
                  console.warn("Invalid signup response:", response);
                  return alert("Signup failed. Please try again.");
                }

                // Save token (using AsyncStorage in AuthContext)
                setToken(response.token)
                
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
            }
              
            fetchUser();
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              {/* enter username */}
              <View style={{ marginBottom: 5 }}>
                  <TextInput
                  placeholder="Enter Username.."
                  placeholderTextColor={"gray"}
                  style={(errors.name && touched.name) ? [styles.input, styles.errInput] : styles.input }
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  />
                  {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                  )}
              </View>

              {/* enter email */}
              <View style={{ marginBottom: 5 }}>
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
      </SafeAreaView>
    );
}



function createStyles() {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    errInput:{
        borderColor: "darkred",
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
