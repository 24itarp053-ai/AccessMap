import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on initial application mount via GET /auth/me
  useEffect(() => {
    async function restoreSession() {
      setLoading(true);
      const res = await getCurrentUser();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  const handleLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const handleRegister = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
