//export const API_URL = import.meta.env.VITE_API_URL + `/` || 'http://localhost:3000';
//export const API_URL = 'https://szsd6fwnn7.execute-api.sa-east-1.amazonaws.com/'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
