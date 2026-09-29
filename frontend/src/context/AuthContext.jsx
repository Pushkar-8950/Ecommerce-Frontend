import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = {
  ADMIN: { email: 'admin@metraverify.demo', password: 'Admin@123', label: 'Admin (Legal Metrology HQ)' },
  BUSINESS: { email: 'business@metraverify.demo', password: 'Business@123', label: 'Business (Apex Logistics)' },
  LMO: { email: 'lmo@metraverify.demo', password: 'Lmo@123', label: 'LMO Officer (Anita Deshmukh)' },
  GATC: { email: 'gatc@metraverify.demo', password: 'Gatc@123', label: 'GATC Centre (Dr. Sandeep)' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('metraverify_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('metraverify_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.error('[Auth Error] Token verification failed', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('metraverify_token', receivedToken);
    localStorage.setItem('metraverify_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem('metraverify_token', receivedToken);
    localStorage.setItem('metraverify_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('metraverify_token');
    localStorage.removeItem('metraverify_user');
    setToken(null);
    setUser(null);
  };

  const quickSwitchRole = async (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
        isAuthenticated: !!user,
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
