import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  authToken: string | null;
  userId: string | null;
  login: (userId: string, token: string, remember: boolean) => void;
  logout: () => void;
  switchAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Load token and userId when the app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("activeAuthToken");
    const storedUserId = localStorage.getItem("activeUserId");

    console.log("🟢 Loaded from storage - Token:", storedToken, "User ID:", storedUserId);

    if (storedToken && storedUserId) {
      setAuthToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  // ✅ Function to log in a user and store multiple accounts
  const login = (userId: string, token: string, remember: boolean) => {
    console.log("🔵 Logging in - User ID:", userId, "Token:", token, "Remember:", remember);

    localStorage.setItem("activeAuthToken", token);
    localStorage.setItem("activeUserId", userId);

    setAuthToken(token);
    setUserId(userId);
  };

  // ✅ Function to log out
  const logout = () => {
    console.log("🔴 Logging out...");
    localStorage.removeItem("activeAuthToken");
    localStorage.removeItem("activeUserId");
    setAuthToken(null);
    setUserId(null);
  };

  // ✅ Function to switch accounts
  const switchAccount = (userId: string) => {
    console.log("🟡 Switching to User ID:", userId);
    const storedData = JSON.parse(localStorage.getItem("authData") || "{}");

    if (storedData[userId]) {
      localStorage.setItem("activeAuthToken", storedData[userId].token);
      localStorage.setItem("activeUserId", userId);
      setAuthToken(storedData[userId].token);
      setUserId(userId);
    } else {
      console.error("⚠️ User not found in stored data");
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to consume AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
