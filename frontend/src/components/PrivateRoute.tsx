// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Loading authentication...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
