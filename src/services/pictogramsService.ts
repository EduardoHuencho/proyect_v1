import type { Categoria, CrearPictogramaInput, Pictograma } from '../types/pictograma';
import { API_URL, authHeaders, parseJson } from './httpClient';

function normalizarPictogramaMayusculas(p: Pictograma): Pictograma {
  return {
    ...p,
    pictogramName: p.pictogramName ? p.pictogramName.toUpperCase() : '',
    description: p.description ? p.description.toUpperCase() : '',
    category: p.category
      ? {
          ...p.category,
          categoryName: p.category.categoryName ? p.category.categoryName.toUpperCase() : '',
        }
      : p.category,
  };
}

export async function getPictograms(token: string | null): Promise<Pictograma[]> {
  const response = await fetch(`${API_URL}/pictogram`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);

  const data = await parseJson<Pictograma[] | { data?: Pictograma[]; pictograms?: Pictograma[] }>(response);
  console.log('Pictograms fetched:', data);
  const lista = Array.isArray(data) ? data : data.data || data.pictograms || [];
  return lista.map(normalizarPictogramaMayusculas);
}

export async function getPictogramsByInfantId(infantId: string, token: string | null): Promise<Pictograma[]> {
  const response = await fetch(`${API_URL}/pictogram/${infantId}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);
  const data = await parseJson<Pictograma[] | { data?: Pictograma[]; pictograms?: Pictograma[] }>(response);
  const lista = Array.isArray(data) ? data : data.data || data.pictograms || [];
  return lista.map(normalizarPictogramaMayusculas);
}

//export async function getPictogramsByTutorId(tutorId: string, token: string | null): Promise<Pictograma[]> {
//  const response = await fetch(`${API_URL}/pictogram/tutor/${tutorId}`, { headers: authHeaders(token) });
//  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);
//  const data = await parseJson<Pictograma[] | { data?: Pictograma[]; pictograms?: Pictograma[] }>(response);
//  return Array.isArray(data) ? data : data.data || data.pictograms || [];
//}

export async function createPictogram(
  input: CrearPictogramaInput,
  token: string | null
): Promise<void> {
  const formData = new FormData();
  formData.append('pictogramName', input.pictogramName.trim().toUpperCase());
  formData.append('description', input.description?.trim().toUpperCase() || '');
  formData.append('categoryId', input.categoryId);
  formData.append('personal', String(input.personal));
  if (input.userId) formData.append('userId', input.userId);
  if (Array.isArray(input.infantId)) {
    input.infantId.forEach((id) => formData.append('infantId[]', id));
  }
  formData.append('file', input.file);

  const response = await fetch(`${API_URL}/pictogram`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string | string[] }>(response);
    const errorMsg = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message || 'CREATION_ERROR';
    throw new Error(errorMsg);
  }
}

export async function updatePictogram(
  pictogramId: string,
  data: { pictogramName?: string; description?: string; personal?: boolean },
  token: string | null
): Promise<void> {
  const payload: { pictogramName?: string; description?: string; personal?: boolean } = {
    ...data,
  };
  if (typeof data.pictogramName === 'string') {
    payload.pictogramName = data.pictogramName.trim().toUpperCase();
  }
  if (typeof data.description === 'string') {
    payload.description = data.description.trim().toUpperCase();
  }

  const response = await fetch(`${API_URL}/pictogram/${pictogramId}`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await parseJson<{ message?: string }>(response);
    throw new Error(body.message || 'UPDATE_ERROR');
  }
}

export async function updatePictogramImage(
  pictogramId: string,
  file: File,
  token: string | null
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/pictogram/${pictogramId}/image`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: formData,
  });
  if (!response.ok) {
    const body = await parseJson<{ message?: string }>(response);
    throw new Error(body.message || 'UPDATE_IMAGE_ERROR');
  }
}

export async function getCategories(token: string | null): Promise<Categoria[]> {
  const response = await fetch(`${API_URL}/category`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('CATEGORY_ERROR');
  const data = await parseJson<Categoria[] | { data?: Categoria[] }>(response);
  return Array.isArray(data) ? data : data.data || [];
}

export async function getCategoryById(categoryId: string, token: string | null): Promise<Categoria> {
  const response = await fetch(`${API_URL}/category/${categoryId}`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error('CATEGORY_ERROR');
  return parseJson<Categoria>(response);
}