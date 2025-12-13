import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  getSession,
  setSession,
  clearSession as clearStoredSession,
  subscribeSession,
} from "../utils/authStorage";

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

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
        // Ne pas effacer la session automatiquement si c'est juste une erreur réseau
        if (error.response?.status === 401) {
          clearUser();
        }
        // Ne pas définir l'utilisateur à null si c'est juste une erreur réseau
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const updateUser = (userData) => {
    // Si c'est juste des données utilisateur partielles (ex: profileImageUrl)
    if (userData && !userData.user && !userData.token) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setSession({
        ...getSession(),
        user: updatedUser,
      });
    }
    // Si c'est une session complète
    else if (userData?.user) {
      setUser(userData.user);
      setSession(userData);
    }
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
