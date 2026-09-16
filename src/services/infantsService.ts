import type { CrearInfanteInput, Infante } from '../types/perfil';
import { API_URL, authHeaders, parseJson } from './httpClient';

export async function getInfants(userId: string, token: string | null): Promise<Infante[]> {
  const response = await fetch(`${API_URL}/user/${userId}/infants`, {
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);
  const data = await parseJson<Infante[] | { infants?: Infante[]; data?: Infante[] }>(response);
  return Array.isArray(data) ? data : data.infants || data.data || [];
}

export async function createInfant(input: CrearInfanteInput, token: string | null): Promise<void> {
  const response = await fetch(`${API_URL}/infant/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error('CREATION_ERROR');
}