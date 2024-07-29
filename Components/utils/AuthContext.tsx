import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getUsertoken,
  getUserName,
  removeUserName,
  removeUsertoken,
} from "./localStorageUtils";
import urls from "./urls";

const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  const login = () => setIsLoggedIn(true);

  const fetchLogout = async (): Promise<{ message: string }> => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { message: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { message: "fail" };
    }
  };

  const logout = async (): Promise<void> => {
    const result = await fetchLogout();
    if (result.message == "success") {
      setIsLoggedIn(false);
      await removeUserName();
      await removeUsertoken();
    }
  };

  useEffect(() => {
    const checkLoginStatus = async (): Promise<void> => {
      const token = await getUsertoken();
      if (token) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
