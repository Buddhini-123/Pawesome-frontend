import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string, referralCode?: string, termsAccepted?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("auth_user");
        const token = localStorage.getItem("auth_token");

        if (savedUser && token) {
          const backendUser = JSON.parse(savedUser);

          // Transform backend user data to frontend format
          const user = {
            ...backendUser,
            name: backendUser.first_name && backendUser.last_name
              ? `${backendUser.first_name} ${backendUser.last_name}`
              : backendUser.name || backendUser.first_name || 'User'
          };

          setUser(user);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
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
        const { user: backendUser, access_token } = data.data;

        // Transform backend user data to frontend format
        const user = {
          ...backendUser,
          name: backendUser.first_name && backendUser.last_name
            ? `${backendUser.first_name} ${backendUser.last_name}`
            : backendUser.name || backendUser.first_name || 'User'
        };

        // Save to localStorage with correct keys
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        setUser(user);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    referralCode?: string,
    termsAccepted: boolean = true
  ) => {
    try {
      const response = await api.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: password,
        phone: phone || undefined,
        referral_code: referralCode || undefined,
        terms_accepted: termsAccepted,
      });

      const data = response.data as {
        success: boolean;
        data: { user: any; access_token: string };
        message?: string;
      };

      if (data.success) {
        const { user: backendUser, access_token } = data.data;

        // Transform backend user data to frontend format
        const user = {
          ...backendUser,
          name: backendUser.first_name && backendUser.last_name
            ? `${backendUser.first_name} ${backendUser.last_name}`
            : backendUser.name || backendUser.first_name || 'User'
        };

        // Save to localStorage (auto-login) with correct keys
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        // Store referral code if present
        if (referralCode) {
          localStorage.setItem('pawsome_referral_code', referralCode);
        }

        setUser(user);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};