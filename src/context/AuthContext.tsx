import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import type { LoginResponse } from '../types/auth';

interface AuthContextValue {
  userId: string | null;
  token: string | null;
  estaAutenticado: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  validatePin: (pin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    const data = await authService.login(email, password);

    localStorage.setItem('userId', data.id);
    localStorage.setItem('token', data.token);

    setUserId(data.id);
    setToken(data.token);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('ninoActivo');

    setUserId(null);
    setToken(null);
  }, []);

  const validatePin = useCallback(async (pin: string): Promise<boolean> => {
    if (!userId || !token) throw new Error('USER_NOT_AUTHENTICATED');
    return authService.validatePin(userId, token, pin);
  }, [userId, token]);

  const value = useMemo<AuthContextValue>(() => ({
    userId,
    token,
    estaAutenticado: Boolean(userId && token),
    login,
    logout,
    validatePin,
  }), [userId, token, login, logout, validatePin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return context;
}