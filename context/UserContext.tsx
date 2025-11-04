import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define user type
export type UserType = {
  username: string;
  email: string;
  password: string;
};

// Context type includes user + actions
type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

useEffect(() => {
  console.log("AsyncStorage module:", AsyncStorage);
}, []);


// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Set user and persist in AsyncStorage
  const setUser = async (newUser: UserType | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem("user");
      }
      setUserState(newUser);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUserState(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for using context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
