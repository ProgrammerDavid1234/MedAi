import React, { createContext, useState, useEffect } from "react";
import localforage from "localforage";

// Define the types for better TypeScript support
interface AuthContextType {
  authToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Load token from localforage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await localforage.getItem<string>("authToken");
        if (token) {
          setAuthToken(token);
        }
      } catch (error) {
        console.error("Error loading auth token:", error);
      }
    };
    loadToken();
  }, []);

  // Function to handle login
  const login = async (token: string) => {
    try {
      await localforage.setItem("authToken", token);
      setAuthToken(token);
    } catch (error) {
      console.error("Error saving auth token:", error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await localforage.removeItem("authToken");
      setAuthToken(null);
    } catch (error) {
      console.error("Error removing auth token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};