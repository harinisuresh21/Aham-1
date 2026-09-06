import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/admin/auth';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aham_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = useCallback(async () => {
    const activeToken = localStorage.getItem('aham_admin_token');
    if (activeToken) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('aham_admin_token');
    setToken(null);
    setAdmin(null);
  }, []);

  // Fetch admin profile on mount if token exists
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && data.admin) {
          setAdmin(data.admin);
        } else {
          // Invalid or expired token
          logout();
        }
      } catch (err) {
        console.warn('Failed to reach admin backend, operating on master session fallback:', err.message);
        if (token === 'master_admin_jwt_demo_token') {
          setAdmin({
            id: 'master_admin_demo',
            name: 'Master Admin',
            email: 'admin@aham.com',
            role: 'SUPER_ADMIN',
            permissions: ['*'],
            lastLogin: new Date(),
          });
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token, logout]);

  // Login handler
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrative credentials.');
      }

      localStorage.setItem('aham_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);

      return { success: true, admin: data.admin };
    } catch (error) {
      if (error.message.includes('Invalid') || error.message.includes('credentials') || error.message.includes('password')) {
        return { success: false, message: error.message };
      }

      // Backend server offline fallback check for Master Admin
      if (cleanEmail === 'admin@aham.com' && password === 'Admin@123456') {
        const masterAdmin = {
          id: 'master_admin_demo',
          name: 'Master Admin',
          email: 'admin@aham.com',
          role: 'SUPER_ADMIN',
          permissions: ['*'],
          lastLogin: new Date(),
        };
        const demoToken = 'master_admin_jwt_demo_token';
        localStorage.setItem('aham_admin_token', demoToken);
        setToken(demoToken);
        setAdmin(masterAdmin);
        return { success: true, admin: masterAdmin };
      }

      return {
        success: false,
        message: 'Backend server is not running on http://localhost:5000. Please start the backend server or verify credentials.',
      };
    }
  };

  // RBAC permission check helpers
  const hasRole = (...roles) => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true; // Master privilege
    return roles.includes(admin.role);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
