import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * On initial mount, if a token exists in localStorage,
   * automatically fetch the latest user profile from GET /api/users/profile
   */
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        // Fetch current user's profile using the stored token
        const response = await api.get('/users/profile');
        const userData = response.data.user || response.data;

        if (isMounted) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.warn('Session verification failed or token expired:', err.message);
        if (isMounted) {
          // Clear stale credentials if token check fails
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user with email and password
   * Calls POST /api/auth/login
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      // Persist in localStorage
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      // Update state
      setToken(receivedToken);
      setUser(receivedUser);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    }
  };

  /**
   * Register user (buyer or artisan)
   * Calls POST /api/auth/register
   */
  const register = async ({ name, email, password, role = 'buyer' }) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      const { token: receivedToken, user: receivedUser } = response.data;

      // Persist in localStorage
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      // Update state
      setToken(receivedToken);
      setUser(receivedUser);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  /**
   * Log out user
   * Removes tokens and clears user state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext conveniently
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
