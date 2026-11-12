import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import type { LoginResponse } from '../types/auth';

export type UserRole = 'user' | 'admin';

export interface LoginResult extends LoginResponse {
  rol: UserRole;
}

interface AuthContextValue {
  userId: string | null;
  token: string | null;
  rol: UserRole;
  esAdmin: boolean;
  estaAutenticado: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  validatePin: (pin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodificarPayloadJwt(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return null;

    const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    return JSON.parse(atob(paddedBase64)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function esTokenValido(token: string | null): boolean {
  const payload = decodificarPayloadJwt(token);
  if (!payload) return false;

  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    return false;
  }
  return true;
}

function obtenerRolDeToken(token: string | null): UserRole {
  const payload = decodificarPayloadJwt(token);
  if (!payload) return 'user';

  const roles = payload.roles;

  if (Array.isArray(roles)) {
    const tieneAdmin = roles.some((r) => String(r).trim().toLowerCase() === 'admin');
    return tieneAdmin ? 'admin' : 'user';
  }

  if (typeof roles === 'string' && roles.trim().toLowerCase() === 'admin') {
    return 'admin';
  }

  return 'user';
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

  const [rol, setRol] = useState<UserRole>(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado && esTokenValido(tokenGuardado)) {
      return obtenerRolDeToken(tokenGuardado);
    }
    return 'user';
  });

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const data = await authService.login(email, password);
    const jwtToken = data.token || data.accessToken || '';
    const rolDetectado = obtenerRolDeToken(jwtToken);

    localStorage.setItem('userId', data.id);
    localStorage.setItem('token', jwtToken);

    setUserId(data.id);
    setToken(jwtToken);
    setRol(rolDetectado);

    return { ...data, rol: rolDetectado };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('ninoActivo');

    setUserId(null);
    setToken(null);
    setRol('user');
  }, []);

  const validatePin = useCallback(async (pin: string): Promise<boolean> => {
    if (!userId || !token) throw new Error('USER_NOT_AUTHENTICATED');
    return authService.validatePin(userId, token, pin);
  }, [userId, token]);

  const value = useMemo<AuthContextValue>(() => ({
    userId,
    token,
    rol,
    esAdmin: Boolean(userId && token && rol === 'admin'),
    estaAutenticado: Boolean(userId && token),
    login,
    logout,
    validatePin,
  }), [userId, token, rol, login, logout, validatePin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return context;
}