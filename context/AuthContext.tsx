import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// export auth type
export type AuthType = string;


type AuthContextType = {
  auth: AuthType | null;
  setToken:  (auth: AuthType | null) => Promise<void>; 
  logout: () => Promise<void>;
  loading: boolean;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined >(undefined);

// Provider
export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
  const [auth, setAuthState] = useState<AuthType | null>(null);
  const [loading,setLoading] = useState(true);

  // Load token from AsyncStorage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        if (storedToken) {
          // setAuthState(JSON.parse(storedToken));
          setAuthState(storedToken);
        }
      } catch (error) {
        console.error("Failed to load token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Set token and persist in AsyncStorage
  const setToken = async (newAuth: AuthType | null) => {
    try {
      if (newAuth) {
        // await AsyncStorage.setItem("userToken", JSON.stringify(newAuth));
        await AsyncStorage.setItem("userToken", newAuth);
      } else {
        await AsyncStorage.removeItem("userToken");
      }
      setAuthState(newAuth);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setAuthState(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};