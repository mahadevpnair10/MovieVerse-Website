// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// IMPORTANT: Use environment variables for API_BASE_URL
// For Vite, you'd use import.meta.env.VITE_API_BASE_URL
// Make sure you have a .env.development and .env.production file in your React project root.
// Example:
// .env.development: VITE_API_BASE_URL=http://127.0.0.1:8000/
// .env.production: VITE_API_BASE_URL=https://mvbackend-6fr8.onrender.com/
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';

const backendApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving cookies (sessionid, csrftoken)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add CSRF token automatically to every POST/PUT/DELETE request
backendApi.interceptors.request.use((config) => {
  // Only add X-CSRFToken for methods that require it (e.g., POST, PUT, DELETE)
  // GET requests typically do not need it in the header.
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '') && config.baseURL === API_BASE_URL) {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    } else {
      // Optional: Log a warning if no CSRF token is found for a mutating request
      console.warn("CSRF token not found for a mutating request. Attempting to fetch it.");
      // This case should ideally be covered by the initial fetchCSRFToken and the one in login()
    }
  }
  return config;
});

// Helper function to extract a cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}

interface User {
  id: string;
  username: string;
  // Add other user fields you expect from your 'api/auth/me/' endpoint
  // e.g., email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean; // <-- ADDED THIS FIELD
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // isLoggedIn is derived from user state
  const isLoggedIn = user !== null; // <-- DERIVED STATE

  // Function to fetch the CSRF cookie from the backend
  const fetchCSRFToken = async () => {
    try {
      // This GET request will trigger Django's ensure_csrf_cookie decorator
      // and set the 'csrftoken' cookie in the browser.
      await backendApi.get('api/auth/csrf/');
      // console.log("CSRF cookie fetched successfully."); // For debugging
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      // Depending on your error handling, you might want to show a message to the user
    }
  };

  // Function to fetch logged-in user information
  const fetchUser = async () => {
    try {
      // This request will attempt to retrieve user data based on the session cookie
      const res = await backendApi.get('api/auth/me/');
      setUser(res.data);
      // console.log("User data fetched:", res.data); // For debugging
    } catch (error) {
      // If 'api/auth/me/' returns an error (e.g., 401 Unauthorized), it means no active session
      console.error('Error fetching user data (likely not logged in):', error);
      setUser(null);
    } finally {
      setIsLoading(false); // Authentication status check is complete
    }
  };

  // Initial load effect: fetch CSRF token and user status
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true); // Ensure loading state is true at the start of init
      await fetchCSRFToken(); // First, get the CSRF token
      await fetchUser();      // Then, check if a user is already logged in
    };
    initAuth();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // It's good practice to ensure a fresh CSRF token before a POST request
      await fetchCSRFToken();
      const response = await backendApi.post('api/auth/login/', { username, password });

      if (response.status === 200) {
        // If login successful, refetch user data to update context
        await fetchUser();
        // console.log("Login successful."); // For debugging
        return true;
      }
      return false; // Should ideally not be reached if Axios throws on non-2xx
    } catch (error) {
      console.error('Login error:', error);
      setUser(null); // Ensure user is null on login failure
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Fetch CSRF token before logout POST, just like login
      await fetchCSRFToken();
      await backendApi.post('api/auth/logout/');
      setUser(null); // Clear user state on successful logout
      // console.log("Logout successful."); // For debugging
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on backend, clear local user state to be safe
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn, login, logout }}> {/* ADDED isLoggedIn HERE */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the configured axios instance for other API calls that need cookies/CSRF
export { backendApi };