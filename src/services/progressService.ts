import type {
  CategoriaProgreso,
  BackendGameProgress,
  CreateGameProgressPayload,
} from '../types/progreso';
import type { Categoria } from '../types/pictograma';
import { getCategories } from './pictogramsService';
import { API_URL, authHeaders, parseJson } from './httpClient';

let cachedGameId: string | null = null;

/**
 * Obtiene el ID del juego "¿Qué es?" desde el backend o usa el ID por defecto.
 */
export async function getGameIdQueEs(token?: string | null): Promise<string> {
  if (cachedGameId) return cachedGameId;
  try {
    const res = await fetch(`${API_URL}/game`, {
      headers: authHeaders(token ?? null),
    });
    if (res.ok) {
      const games = await parseJson<Array<{ id: string; name: string }>>(res);
      if (Array.isArray(games) && games.length > 0) {
        const found = games.find((g) => g.name.toLowerCase().includes('que')) || games[0];
        if (found?.id) {
          cachedGameId = found.id;
          return found.id;
        }
      }
    }
  } catch (err) {
    console.error('Error al obtener ID del juego:', err);
  }
  return '8970d580-456f-4390-9f69-f157e4d10b4c';
}

/**
 * Guarda el progreso de una partida en la base de datos a través del endpoint POST /game-progress.
 */
export async function saveGameProgress(
  payload: CreateGameProgressPayload,
  token?: string | null
): Promise<BackendGameProgress | null> {
  try {
    const response = await fetch(`${API_URL}/game-progress`, {
      method: 'POST',
      headers: {
        ...authHeaders(token ?? null),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status} al guardar progreso en backend:`, errorText);
      return null;
    }

    return await parseJson<BackendGameProgress>(response);
  } catch (err) {
    console.error('Error de red al guardar progreso:', err);
    return null;
  }
}

/**
 * Obtiene el historial de partidas de un infante desde el endpoint GET /game-progress/infant/:infantId.
 */
export async function getInfantGameProgressFromBackend(
  infantId: string,
  token?: string | null
): Promise<BackendGameProgress[]> {
  if (!infantId) return [];
  try {
    const response = await fetch(`${API_URL}/game-progress/infant/${infantId}`, {
      headers: authHeaders(token ?? null),
    });

    if (!response.ok) {
      console.warn(`Respuesta ${response.status} al consultar progreso de infante`);
      return [];
    }

    const data = await parseJson<BackendGameProgress[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error al obtener progreso del infante desde el backend:', err);
    return [];
  }
}

/**
 * Obtiene el listado consolidado de categorías con sus aciertos y totales para la vista de progreso.
 * Combina las partidas reales desde la base de datos con todas las categorías registradas.
 */
export async function getInfantProgress(
  infantId: string,
  token: string | null
): Promise<CategoriaProgreso[]> {
  if (!infantId) return [];

  // Obtener en paralelo categorías del sistema y partidas del infante
  const [categoriasSistema, partidasBackend] = await Promise.all([
    getCategories(token).catch(() => [] as Categoria[]),
    getInfantGameProgressFromBackend(infantId, token),
  ]);

  // Mapa de acumulación por categoría: id -> { id, nombre, correctas, totales, color }
  const mapaCategorias: Record<string, CategoriaProgreso> = {};

  // Inicializar con todas las categorías del sistema
  categoriasSistema.forEach((cat) => {
    mapaCategorias[cat.id] = {
      id: cat.id,
      nombre: cat.categoryName,
      correctas: 0,
      totales: 0,
      color: cat.color,
    };
  });

  // Acumular los aciertos e intentos de cada partida registrada en la base de datos
  partidasBackend.forEach((partida) => {
    const catId = partida.categoryPlayed?.id;
    if (!catId) return;

    if (!mapaCategorias[catId]) {
      mapaCategorias[catId] = {
        id: catId,
        nombre: partida.categoryPlayed?.categoryName || 'General',
        correctas: 0,
        totales: 0,
        color: partida.categoryPlayed?.color,
      };
    }

    mapaCategorias[catId].correctas += Number(partida.correctAnswers) || 0;
    mapaCategorias[catId].totales += Number(partida.totalAnswers) || 0;
  });

  return Object.values(mapaCategorias);
}

/**
 * Función de compatibilidad para registrar intentos individuales si es necesario.
 */
export function registrarIntentoJuego(
  infantId: string,
  categoriaId: string,
  categoriaNombre: string,
  esCorrecta: boolean,
  color?: string
): void {
  // Los registros ahora se envían directamente al backend en saveGameProgress
  void infantId;
  void categoriaId;
  void categoriaNombre;
  void esCorrecta;
  void color;
}
