import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe as apiGetMe,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applySession = useCallback((nextUser) => {
    setUser(nextUser || null);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const { user: fetchedUser } = await apiGetMe();
      applySession(fetchedUser);
      setError(null);
    } catch (err) {
      applySession(null);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      try {
        const { user: nextUser } = await apiLogin(credentials);
        applySession(nextUser);
        return { user: nextUser };
      } catch (err) {
        setError(err?.message || 'Login failed');
        applySession(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const { user: nextUser } = await apiRegister(payload);
        applySession(nextUser);
        return { user: nextUser };
      } catch (err) {
        setError(err?.message || 'Registration failed');
        applySession(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout error", e);
    }
    applySession(null);
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      refresh: fetchMe,
      // Since we rely on HTTPOnly cookies, we measure authentication merely by whether user data exists.
      isAuthenticated: !!user,
    }),
    [user, loading, error, login, register, logout, fetchMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
