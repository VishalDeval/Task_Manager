// client/src/components/layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Changed 'loading' to 'isLoading' to match AuthContext
  const location = useLocation();

  if (isLoading) {
    // You might want to show a global loading spinner here or a minimal placeholder
    return <div style={{ textAlign: 'center', padding: '50px' }}>Checking authentication...</div>; 
  }

  if (!isAuthenticated) {
    // Redirect them to the /auth page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
