import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUserName,
  removeUserName,
  removeUsertoken,
} from "./localStorageUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const login = () => setIsLoggedIn(true);
  const logout = async () => {
    setIsLoggedIn(false);
    await removeUserName();
    await removeUsertoken();
  };

  useEffect(() => {
    const loadData = async () => {
      const username = await getUserName();
      setUserName(username);
    };

    loadData();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
