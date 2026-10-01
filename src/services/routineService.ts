import type { Actividad, RutinaAgrupadaDia, RutinaDia } from '../types/horario';
import { API_URL, authHeaders, parseJson } from './httpClient';

export async function getGroupedRoutine(
  infantId: string,
  token: string | null
): Promise<RutinaAgrupadaDia[]> {
  const response = await fetch(`${API_URL}/routine/infant/${infantId}/grouped`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData = await parseJson<{ message?: string }>(response);
    throw new Error(errorData.message || 'ERROR_AL_OBTENER_RUTINAS');
  }

  return parseJson<RutinaAgrupadaDia[]>(response);
}

export async function createRoutine(
  data: RutinaDia,
  token: string | null
): Promise<{ id: string }> {
  const response = await fetch(`${API_URL}/routine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await parseJson<{ message?: string }>(response);
    throw new Error(errorData.message || 'ERROR_AL_CREAR_RUTINA');
  }

  return parseJson<{ id: string }>(response);
}

export async function createRoutineActivity(
  routineId: string,
  actividad: Actividad,
  token: string | null
): Promise<void> {
  const response = await fetch(`${API_URL}/routine/${routineId}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(actividad),
  });

  if (!response.ok) {
    const errorData = await parseJson<{ message?: string }>(response);
    throw new Error(errorData.message || 'ERROR_AL_CREAR_ACTIVIDAD');
  }
}

export async function updateRoutineActivity(
  routineId: string,
  activityId: string,
  actividad: Partial<Actividad>,
  token: string | null
): Promise<void> {
  const response = await fetch(`${API_URL}/routine/${routineId}/activities/${activityId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(actividad),
  });

  if (!response.ok) {
    const errorData = await parseJson<{ message?: string }>(response);
    throw new Error(errorData.message || 'ERROR_AL_ACTUALIZAR_ACTIVIDAD');
  }
}

export async function deleteRoutineActivity(
  routineId: string,
  activityId: string,
  token: string | null
): Promise<void> {
  const response = await fetch(`${API_URL}/routine/${routineId}/activities/${activityId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorData = await parseJson<{ message?: string }>(response);
    throw new Error(errorData.message || 'ERROR_AL_ELIMINAR_ACTIVIDAD');
  }
}