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
        console.error('Failed to authenticate admin token:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [token, logout]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('aham_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);

      return { success: true, admin: data.admin };
    } catch (error) {
      return { success: false, message: error.message };
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
