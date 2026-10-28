import type { RondaJuego, PictogramaJuego } from '../types/game';
import { API_URL, authHeaders, parseJson } from './httpClient';

/**
 * Inicia el juego "¿Qué es?" obteniendo las rondas según la categoría especificada.
 * Endpoint: game/start/game/what-it-is/category/:categoryId
 */
export async function getGameWhatItIsByCategory(
  categoryId: string,
  token: string | null
): Promise<RondaJuego[]> {
  const response = await fetch(
    `${API_URL}/game/start/game/what-it-is/category/${categoryId}?_t=${Date.now()}`,
    {
      headers: {
        ...authHeaders(token),
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP_ERROR_${response.status}`);
  }

  const data = await parseJson<RondaJuego[] | { data?: RondaJuego[]; rounds?: RondaJuego[] }>(response);
  return Array.isArray(data) ? data : data.data || data.rounds || [];
}

/**
 * Obtiene todos los pictogramas asociados a la categoría para ampliar el pool de distractores.
 * Endpoint: pictogram/category/:categoryId
 */
export async function getPictogramsByCategory(
  categoryId: string,
  token: string | null
): Promise<PictogramaJuego[]> {
  try {
    const response = await fetch(
      `${API_URL}/pictogram/category/${categoryId}?_t=${Date.now()}`,
      {
        headers: {
          ...authHeaders(token),
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];

    const data = await parseJson<PictogramaJuego[] | { data?: PictogramaJuego[]; pictograms?: PictogramaJuego[] }>(response);
    return Array.isArray(data) ? data : data.data || data.pictograms || [];
  } catch {
    return [];
  }
}
