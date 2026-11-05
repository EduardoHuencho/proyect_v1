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

export async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
