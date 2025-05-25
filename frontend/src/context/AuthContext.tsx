// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';  // Adjust to your backend

const backendApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add CSRF token automatically to every request
backendApi.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch CSRF cookie from backend
  const fetchCSRFToken = async () => {
    try {
      await backendApi.get('api/auth/csrf/');
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
    }
  };

  // Fetch logged in user info
  const fetchUser = async () => {
    try {
      const res = await backendApi.get('api/auth/me/', {
        withCredentials: true // Ensure cookies are sent with the request
      });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: fetch CSRF and user
  useEffect(() => {
    const initAuth = async () => {
      await fetchCSRFToken();
      await fetchUser();
    };
    initAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      await fetchCSRFToken(); // Always fetch CSRF before POST
      const response = await backendApi.post('api/auth/login/', { username, password });
      if (response.status === 200) {
        await fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      setUser(null);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await backendApi.post('api/auth/logout/');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { backendApi };
