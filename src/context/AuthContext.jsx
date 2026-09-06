import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getInitialAuth();
        if (session.user) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (err) {
        console.error('Error initializing customer authentication:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      if (toast?.success) toast.success(`Welcome back, ${res.user.name || 'Customer'}!`, 'Signed In');
      return { success: true, user: res.user };
    } catch (error) {
      if (toast?.error) toast.error(error.message || 'Login failed', 'Sign In Failed');
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      setToken(res.token);
      if (toast?.success) toast.success(`Welcome to AHAM, ${res.user.name}!`, 'Account Created');
      return { success: true, user: res.user };
    } catch (error) {
      if (toast?.error) toast.error(error.message || 'Registration failed', 'Sign Up Failed');
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      if (toast?.info) toast.info('You have signed out successfully.', 'Signed Out');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
