import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  getSession,
  setSession,
  clearSession as clearStoredSession,
  subscribeSession,
} from "../utils/authStorage";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initialSession = getSession();
  const [user, setUser] = useState(initialSession.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSession(({ user: sessionUser }) => {
      setUser(sessionUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const { token } = getSession();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
        setSession({
          ...getSession(),
          user: response.data,
        });
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const updateUser = (sessionData) => {
    if (sessionData?.user) {
      setUser(sessionData.user);
    }
    setSession(sessionData);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    clearStoredSession();
  };

  const logout = async () => {
    try {
      const { refreshToken } = getSession();
      if (refreshToken) {
        await axiosInstance.post(API_PATHS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      clearUser();
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;