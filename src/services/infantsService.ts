import type { ActualizarInfanteInput, CrearInfanteInput, Infante } from '../types/perfil';
import { API_URL, authHeaders, parseJson } from './httpClient';

export async function getInfants(userId: string, token: string | null): Promise<Infante[]> {
  let response = await fetch(`${API_URL}/user/${userId}/infants`, {
    headers: authHeaders(token),
  });

  if (!response.ok && response.status === 404) {
    response = await fetch(`${API_URL}/infant`, {
      headers: authHeaders(token),
    });
  }

  if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);
  const data = await parseJson<Infante[] | { infants?: Infante[]; data?: Infante[] }>(response);
  const lista = Array.isArray(data) ? data : data.infants || data.data || [];

  const listaConAvatares = await Promise.all(
    lista.map(async (infante) => {
      if (infante.avatarUrl && infante.avatarUrl.startsWith('blob:')) {
        return { ...infante, avatarUrl: null };
      }

      if (
        infante.avatarUrl &&
        !infante.avatarUrl.startsWith('http') &&
        !infante.avatarUrl.startsWith('/src') &&
        !infante.avatarUrl.startsWith('/assets')
      ) {
        try {
          const res = await fetch(`${API_URL}/storage/${encodeURIComponent(infante.avatarUrl)}/url`, {
            headers: authHeaders(token),
          });
          if (res.ok) {
            const { url } = await parseJson<{ url: string }>(res);
            if (url) {
              return { ...infante, avatarUrl: url };
            }
          }
        } catch (e) {
          console.error(`Error al resolver URL de avatar para ${infante.id}:`, e);
        }
      }
      console.log('url apii:', API_URL);
      console.log('info:', data);
      return infante;
    })
  );

  return listaConAvatares;
}

export async function uploadInfantAvatar(
  id: string,
  file: File,
  token: string | null
): Promise<Record<string, unknown>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/infant/${id}/avatar`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string | string[] }>(response);
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'AVATAR_UPLOAD_ERROR');
  }

  return parseJson<Record<string, unknown>>(response);
}

export async function updateInfantAvatar(
  id: string,
  file: File,
  token: string | null
): Promise<Record<string, unknown>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/infant/${id}/avatar`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string | string[] }>(response);
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'AVATAR_UPDATE_ERROR');
  }

  return parseJson<Record<string, unknown>>(response);
}

export async function createInfant(
  input: CrearInfanteInput,
  token: string | null
): Promise<Infante> {
  const response = await fetch(`${API_URL}/infant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      birthDate: input.birthDate,
      userId: input.userId,
      avatarUrl: input.avatarUrl || '/src/assets/panda.png',
    }),
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string | string[] }>(response);
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'CREATION_ERROR');
  }

  const nuevoInfante = await parseJson<Infante>(response);

  if (input.file) {
    try {
      const resAvatar = await uploadInfantAvatar(nuevoInfante.id, input.file, token);
      if (resAvatar && typeof resAvatar.avatarUrl === 'string') {
        nuevoInfante.avatarUrl = resAvatar.avatarUrl;
      }
    } catch (avatarError) {
      console.error('Error al subir el avatar del infante:', avatarError);
      throw avatarError;
    }
  }

  return nuevoInfante;
}

export async function updateInfant(
  id: string,
  input: ActualizarInfanteInput,
  token: string | null
): Promise<Infante> {
  const payload: Record<string, string> = {};
  if (input.firstName) payload.firstName = input.firstName.trim();
  if (input.lastName) payload.lastName = input.lastName.trim();
  if (input.birthDate) payload.birthDate = input.birthDate;

  const response = await fetch(`${API_URL}/infant/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await parseJson<{ message?: string | string[] }>(response);
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'UPDATE_ERROR');
  }

  const infanteActualizado = await parseJson<Infante>(response);

  if (input.file) {
    try {
      const resAvatar = await updateInfantAvatar(id, input.file, token);
      if (resAvatar && typeof resAvatar.avatarUrl === 'string') {
        infanteActualizado.avatarUrl = resAvatar.avatarUrl;
      }
    } catch (avatarError) {
      console.error('Error al actualizar el avatar del infante:', avatarError);
      throw avatarError;
    }
  }

  return infanteActualizado;
}