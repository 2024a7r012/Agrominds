import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(api.getToken());
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    if (!api.getToken()) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginWithToken = (newToken, userData, profileData) => {
    api.setToken(newToken);
    setToken(newToken);
    setUser(userData);
    setProfile(profileData || userData);
  };

  const loginWithDev = async (email) => {
    setLoading(true);
    try {
      const res = await api.devLogin(email);
      if (res.success && res.data) {
        loginWithToken(res.data.token, res.data.user, res.data.user);
        return { success: true, notice: res.data.notice };
      }
      return { success: false, message: 'Failed to complete development login' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateMe(data);
      if (res.success && res.data) {
        setProfile(res.data);
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: Boolean(user),
        loading,
        loginWithToken,
        loginWithDev,
        logout,
        updateProfile,
        refreshProfile: fetchCurrentUser
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
