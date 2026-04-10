import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (token) {
      authAPI.getMe()
        .then(({ user }) => setUser(user))
        .catch(() => {
          localStorage.removeItem('ss_token');
          localStorage.removeItem('ss_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { token, user } = await authAPI.login({ email, password });
      localStorage.setItem('ss_token', token);
      localStorage.setItem('ss_user', JSON.stringify(user));
      setUser(user);
      return { success: true, role: user.role };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const { token, user } = await authAPI.register(data);
      localStorage.setItem('ss_token', token);
      localStorage.setItem('ss_user', JSON.stringify(user));
      setUser(user);
      return { success: true, role: user.role };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const { user: updated } = await authAPI.updateProfile(data);
      setUser(updated);
      localStorage.setItem('ss_user', JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const changePassword = useCallback(async (data) => {
    try {
      const { token, user: updated } = await authAPI.changePassword(data);
      localStorage.setItem('ss_token', token);
      localStorage.setItem('ss_user', JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight:'100vh',display:'flex',alignItems:'center',
        justifyContent:'center',background:'#f8fafc',
        fontFamily:'sans-serif',color:'#64748b',fontSize:18,
      }}>
        Loading StaySphere...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, updateProfile, changePassword,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
