import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, admin, hasRole } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600 font-medium">Authenticating Admin Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your role (<span className="font-semibold text-gray-800">{admin?.role}</span>) does not have authorization to view this section.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary/90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
