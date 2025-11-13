import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// base Api Handler for the Client to the Server
const apiClient = axios.create({
    // baseURL: "http://10.94.115.16:5000",
    baseURL: "http://localhost:5000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

// for intercepting requests to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default apiClient;