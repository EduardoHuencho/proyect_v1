import type { Categoria, CrearPictogramaInput, Pictograma } from '../types/pictograma';
import { API_URL, authHeaders, parseJson } from './httpClient';

export async function getPictograms(token: string | null): Promise<Pictograma[]> {
  const response = await fetch(`${API_URL}/pictogram`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);

  const data = await parseJson<Pictograma[] | { data?: Pictograma[]; pictograms?: Pictograma[] }>(response);
  return Array.isArray(data) ? data : data.data || data.pictograms || [];
}

export async function createPictogram(
  input: CrearPictogramaInput,
  token: string | null
): Promise<void> {
  const formData = new FormData();
  formData.append('pictogramName', input.pictogramName.trim());
  formData.append('description', input.description?.trim() || '');
  formData.append('categoryId', input.categoryId);
  if (input.userId) formData.append('userId', input.userId);
  if (input.infantId) formData.append('infantId', input.infantId);
  formData.append('file', input.file);

  const response = await fetch(`${API_URL}/pictogram`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string }>(response);
    throw new Error(data.message || 'CREATION_ERROR');
  }
}

export async function getCategories(token: string | null): Promise<Categoria[]> {
  const response = await fetch(`${API_URL}/category`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('CATEGORY_ERROR');
  const data = await parseJson<Categoria[] | { data?: Categoria[] }>(response);
  return Array.isArray(data) ? data : data.data || [];
}