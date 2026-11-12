import { API_URL, authHeaders, parseJson } from '../../services/httpClient';
import type { AdminPictogram, BackendAdminPictogram } from '../types/adminPictogram';

function mapBackendPictogramToAdmin(item: BackendAdminPictogram): AdminPictogram {
  return {
    id: item.id,
    name: item.pictogramName || 'Sin nombre',
    description: item.description || '',
    category: item.category?.categoryName || 'Sin categoría',
    categoryColor: item.category?.color,
    imageUrl: item.pictoImageUrl,
    isPublic: !item.personal,
    infantId: item.infantId || [],
  };
}

export async function getAllPictogramsAdmin(token: string | null): Promise<AdminPictogram[]> {
  const response = await fetch(`${API_URL}/pictogram`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`HTTP_ERROR_${response.status}`);
  }

  const data = await parseJson<
    BackendAdminPictogram[] | { data?: BackendAdminPictogram[]; pictograms?: BackendAdminPictogram[] }
  >(response);

  const lista = Array.isArray(data) ? data : data.data || data.pictograms || [];
  return lista.map(mapBackendPictogramToAdmin);
}

export async function deletePictogramAdmin(
  pictogramId: string,
  token: string | null
): Promise<void> {
  const response = await fetch(`${API_URL}/pictogram/delete/${pictogramId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorBody = await parseJson<{ message?: string }>(response).catch(() => null);
    throw new Error(errorBody?.message || `HTTP_ERROR_${response.status}`);
  }
}