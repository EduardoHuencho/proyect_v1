import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback(async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!response.ok) {
      throw new Error('AUTH_ERROR');
    }

    const data = await response.json();

    if (data.id && data.token) {
      localStorage.setItem('userId', data.id);
      localStorage.setItem('token', data.token);
      setUserId(data.id);
      setToken(data.token);
    }

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUserId(null);
    setToken(null);
  }, []);

  const validatePin = useCallback(async (pin) => {
    const currentUserId = userId || localStorage.getItem('userId');
    const currentToken = token || localStorage.getItem('token');

    if (!currentUserId || !currentToken) {
      throw new Error('USER_NOT_AUTHENTICATED');
    }

    const response = await fetch(`http://localhost:3000/user/${currentUserId}/validate-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ pin }),
    });

    if (!response.ok) {
      throw new Error('PIN_VALIDATION_FAILED');
    }

    return await response.json(); 
  }, [userId, token]);

  const value = useMemo(
    () => ({
      userId,
      token,
      estaAutenticado: Boolean(userId),
      login,
      logout,
      validatePin,
    }),
    [userId, token, login, logout, validatePin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}