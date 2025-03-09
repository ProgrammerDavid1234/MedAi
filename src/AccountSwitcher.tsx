import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const AccountSwitcher = () => {
  const { authToken, logout, switchAccount } = useContext(AuthContext)!;
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);

  // Load available users from localStorage
  React.useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
    setAvailableUsers(Object.keys(storedTokens));
  }, []);

  return (
    <div>
      <h3>Current Token: {authToken ? authToken : "No user logged in"}</h3>

      {/* Account Switching */}
      <h4>Switch Account</h4>
      {availableUsers.map((user) => (
        <button key={user} onClick={() => switchAccount(user)}>
          Switch to {user}
        </button>
      ))}

      {/* Logout */}
      <button onClick={logout} style={{ marginTop: "10px", color: "red" }}>
        Logout
      </button>
    </div>
  );
};

export default AccountSwitcher;
