import type { RondaJuego } from '../types/game';
import { API_URL, authHeaders, parseJson } from './httpClient';

/**
 * Inicia el juego "¿Qué es?" obteniendo las rondas según la categoría especificada.
 * Endpoint: game/start/game/what-it-is/category/:categoryId
 */
export async function getGameWhatItIsByCategory(
  categoryId: string,
  token: string | null
): Promise<RondaJuego[]> {
  const response = await fetch(`${API_URL}/game/start/game/what-it-is/category/${categoryId}`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('Error al llamar game/start/game/what-it-is/category:', response.status, errorText);
    throw new Error(`HTTP_ERROR_${response.status}`);
  }

  const data = await parseJson<RondaJuego[] | { data?: RondaJuego[]; rounds?: RondaJuego[] }>(response);
  return Array.isArray(data) ? data : data.data || data.rounds || [];
}
