// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 

import axios from 'axios'; // Import Axios

// Configure Axios instance for backend
const API_BASE_URL = 'https://mvbackend-6fr8.onrender.com/'; // Your backend URL
const backendApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: This sends and receives cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// In your AuthContext.tsx, after defining backendApi
backendApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Check if the error is due to authentication and it's not the login or refresh endpoint itself
    if (error.response?.status === 401 || error.response?.status === 403) {
      // You might have a specific error for "session expired" vs "bad credentials"
      console.warn('Session expired or unauthorized. Redirecting to login.');
      // Use window.location.href or navigate from context to ensure full page reload/redirection
      // A simple window.location.href = '/login' can be effective for session auth
      window.location.href = '/login'; // Force redirect to login page
      // Or if you want to use react-router's navigate, you'd need to get it from context
      // For now, hard reload is okay for session expiration.
    }
    return Promise.reject(error);
  }
);

interface AuthState {
  isLoggedIn: boolean;
  user: { username: string; id: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>; // Logout will also be an async operation
  getCSRFToken: () => Promise<string | null>; // Function to get CSRF token
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; id: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Helper to get CSRF token from the browser's cookies
  const getCookie = (name: string) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)');
    return cookieValue ? decodeURIComponent(cookieValue[2]) : null;
  };

  const getCSRFToken = async (): Promise<string | null> => {
    try {
      // Make a GET request to trigger the backend to set the csrftoken cookie
      await backendApi.get('api/auth/csrf/');
      const token = getCookie('csrftoken');
      if (token) {
        backendApi.defaults.headers.common['X-CSRFToken'] = token;
        return token;
      }
      return null;
    } catch (err) {
      console.error('Error fetching CSRF token:', err);
      return null;
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch a protected resource (e.g., test endpoint or user details)
        // A 200 OK means authenticated, 401/403 means not.
        const response = await backendApi.get('api/auth/test/'); // Your test endpoint
        if (response.status === 200) {
          setIsLoggedIn(true);
          // Fetch actual user details if test endpoint doesn't return them
          // Example: You might need a dedicated endpoint like /api/auth/me/ to get user data
          setUser({ username: response.data.username || 'Authenticated User', id: response.data.id || 'N/A' });
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          console.log('Not authenticated (401/403) or session expired.');
          setIsLoggedIn(false);
          setUser(null);
        } else {
          console.error('Error checking authentication status:', error);
          // Could be network error or other server issues, treat as not logged in for safety
          setIsLoggedIn(false);
          setUser(null);
        }
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthStatus();
  }, []); // Run once on mount

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Ensure we have a fresh CSRF token before login POST
      await getCSRFToken();

      const response = await backendApi.post('api/auth/login/', { username, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
        // You might need a separate call to get user details after login if not in response
        // For now, setting a dummy user or fetching from a /me endpoint if available
        setUser({ username: username, id: 'some_user_id' }); // Replace with actual user ID from backend
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login failed:', error.response.data);
        // Handle specific login errors (e.g., invalid credentials)
      } else {
        console.error('Login error:', error);
      }
      setIsLoggedIn(false);
      setUser(null);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await getCSRFToken(); // Get CSRF token for logout POST request
      const response = await backendApi.post('api/auth/logout/');
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser(null);
        // Axios instance needs to clear the CSRF token from headers after logout
        delete backendApi.defaults.headers.common['X-CSRFToken'];
        // Also clear any lingering sessionid cookie if necessary (browser usually handles this on its own)
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear frontend state for user experience
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const value = {
    isLoggedIn,
    user,
    accessToken: null, // No explicit access tokens in session auth
    refreshToken: null, // No explicit refresh tokens in session auth
    login,
    logout,
    getCSRFToken, // Expose CSRF token getter for other components if needed (e.g., register)
  };

  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the configured axios instance for other API calls
export { backendApi };