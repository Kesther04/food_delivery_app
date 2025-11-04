import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

export default function ForgotPassword() {
    const styles = createStyles();
    const router = useRouter();

    // Validation schema with Yup
    const SignInSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
    });

    return (
        <SafeAreaView style={styles.container}>
            
            <Pressable style={{ marginBottom: 20 }} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>

            {/* heading */}
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Forgot Password Screen</Text>

            {/* sub heading  */}
            <Text style={{ marginBottom: 20, color: "gray" }}>
                Please enter your email address below to receive password reset instructions.
            </Text>

            {/* formik form */}
            <Formik
                initialValues={{ email: ""}}
                validationSchema={SignInSchema}
                onSubmit={(values) => {
                // You can call your API here
                console.log("Form submitted:", values);
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

                    {/* pressable button for submitting info */}
                    <Pressable style={styles.btn} onPress={() => handleSubmit()}>
                    <Text style={{ color: "white" }}>Submit</Text>
                    </Pressable>
                </View>
                )}
            </Formik>

        </SafeAreaView>
    )
}


function createStyles() {
  return StyleSheet.create({
    container:{
        padding:20,
        flex:1,
        backgroundColor:"white"
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
