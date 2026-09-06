import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (toast?.info) {
        toast.info(
          location.pathname === '/checkout'
            ? 'Please sign in or create an account to proceed with checkout.'
            : 'Please sign in to access your account profile.',
          'Authentication Required'
        );
      }
    }
  }, [loading, isAuthenticated, location.pathname, toast]);

  if (loading) {
    return (
      <div className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-brand-muted">Verifying authentication status...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
