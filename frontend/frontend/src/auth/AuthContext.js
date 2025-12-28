import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
  });

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // ⬇️ NO JSX HERE
  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
