import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  authToken: string | null;
  login: (user: string, token: string, remember: boolean) => void;
  logout: () => void;
  switchAccount: (user: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Load token when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("activeAuthToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  // Function to log in a user and store multiple accounts
  const login = (user: string, token: string, remember: boolean) => {
    const storedTokens = JSON.parse(localStorage.getItem("authTokens") || "{}");

    // Save user token
    storedTokens[user] = token;
    localStorage.setItem("authTokens", JSON.stringify(storedTokens));

    if (remember) {
      localStorage.setItem("activeAuthToken", token);
    }
    setAuthToken(token);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("activeAuthToken");
    setAuthToken(null);
  };

  // Function to switch accounts
  const switchAccount = (user: string) => {
    const storedTokens = JSON.parse(localStorage.getItem("authTokens") || "{}");

    if (storedTokens[user]) {
      localStorage.setItem("activeAuthToken", storedTokens[user]);
      setAuthToken(storedTokens[user]);
    } else {
      console.error("User not found");
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
