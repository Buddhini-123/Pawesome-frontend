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
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 new
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 new

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user, access_token } = response.data.data;

        // Save to localStorage
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        return user;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUser = () => {
    if (!user) {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsAuthenticated(true);
        return parsed;
      }
    }
    return user;
  };

  return { user, login, logout, getUser, isLoading, isAuthenticated };
}

