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

function esTokenValido(token: string | null): boolean {
  if (!token) return false;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;

    const payloadJson = JSON.parse(atob(payloadBase64));

    if (payloadJson.exp && payloadJson.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado && esTokenValido(tokenGuardado)) {
      return tokenGuardado;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('ninoActivo');
    return null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado && esTokenValido(tokenGuardado)) {
      return localStorage.getItem('userId');
    }
    return null;
  });

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    const data = await authService.login(email, password);
    const jwtToken = data.token || data.accessToken || '';

    localStorage.setItem('userId', data.id);
    localStorage.setItem('token', jwtToken);

    setUserId(data.id);
    setToken(jwtToken);

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