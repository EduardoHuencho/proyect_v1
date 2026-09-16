import type { LoginResponse, RegisterTutorInput } from '../types/auth';
import { API_URL, parseJson } from './httpClient';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  if (!response.ok) throw new Error('AUTH_ERROR');
  return parseJson<LoginResponse>(response);
}

export async function registerTutor(input: RegisterTutorInput): Promise<void> {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let data: { message?: string };

    try {
      data = JSON.parse(responseText) as { message?: string };
    } catch {
      throw new Error('REGISTER_ERROR');
    }

    throw new Error(data.message || 'REGISTER_ERROR');
  }
}

export async function validatePin(
  userId: string,
  token: string,
  pin: string
): Promise<boolean> {
  const response = await fetch(`${API_URL}/user/${userId}/validate-pin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pin }),
  });

  return response.ok;
}