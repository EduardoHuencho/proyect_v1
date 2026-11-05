export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export function authHeaders(token?: string | null): HeadersInit {
  const jwt = token ?? getStoredToken();
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

export function manejarSesionExpirada(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('ninoActivo');

  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
}

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = async function (...args: Parameters<typeof originalFetch>): Promise<Response> {
    const response = await originalFetch.apply(this, args);

    // Si cualquier endpoint protegido rechaza el token con 401 Unauthorized
    if (response.status === 401) {
      manejarSesionExpirada();
    }

    return response;
  };
}

export async function parseJson<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    manejarSesionExpirada();
    throw new Error('SESSION_EXPIRED');
  }
  return response.json() as Promise<T>;
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    manejarSesionExpirada();
    throw new Error('SESSION_EXPIRED');
  }

  return response;
}
