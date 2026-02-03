// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
  
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
  
//   return context;
// };


import { useState, useEffect } from "react";
import {api} from "../services/api"

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 new
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 new

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data as {
        success: boolean;
        data: { user: any; access_token: string };
        message?: string;
      };

      if (data.success) {
        const { user, access_token } = data.data;

        // Save to localStorage with correct keys
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        return user;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });

      const data = response.data as {
        success: boolean;
        data: { user: any; access_token: string };
        message?: string;
      };

      if (data.success) {
        const { user, access_token } = data.data;

        // Save to localStorage (auto-login) with correct keys
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        return user;
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUser = () => {
    if (!user) {
      const saved = localStorage.getItem("auth_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsAuthenticated(true);
        return parsed;
      }
    }
    return user;
  };

  return { user, login, register, logout, getUser, isLoading, isAuthenticated };
}

