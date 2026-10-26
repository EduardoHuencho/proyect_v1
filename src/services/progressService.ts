import type { CategoriaProgreso } from '../types/progreso';
import type { Categoria } from '../types/pictograma';
import { getCategories } from './pictogramsService';

const STORAGE_KEY = 'historial_progreso_infantes';

type HistorialInfantes = Record<string, Record<string, CategoriaProgreso>>;

function leerHistorial(): HistorialInfantes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistorialInfantes) : {};
  } catch {
    return {};
  }
}

function guardarHistorial(historial: HistorialInfantes): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  } catch (err) {
    console.error('Error al guardar progreso en localStorage:', err);
  }
}

/**
 * Registra un intento de respuesta en el juego para un infante y una categoría.
 */
export function registrarIntentoJuego(
  infantId: string,
  categoriaId: string,
  categoriaNombre: string,
  esCorrecta: boolean,
  color?: string
): void {
  if (!infantId || !categoriaId) return;

  const historial = leerHistorial();
  if (!historial[infantId]) {
    historial[infantId] = {};
  }

  const prev = historial[infantId][categoriaId] || {
    id: categoriaId,
    nombre: categoriaNombre,
    correctas: 0,
    totales: 0,
    color,
  };

  historial[infantId][categoriaId] = {
    ...prev,
    nombre: categoriaNombre || prev.nombre,
    totales: prev.totales + 1,
    correctas: esCorrecta ? prev.correctas + 1 : prev.correctas,
    color: color || prev.color,
  };

  guardarHistorial(historial);
}

/**
 * Obtiene el listado de progreso de las categorías para un infante determinado.
 * Si el infante no tiene historial previo, genera una estructura inicial con las
 * categorías del sistema.
 */
export async function getInfantProgress(
  infantId: string,
  token: string | null
): Promise<CategoriaProgreso[]> {
  if (!infantId) return [];

  const historial = leerHistorial();
  let categoriasSistema: Categoria[] = [];

  try {
    categoriasSistema = await getCategories(token);
  } catch {
    // Si la API de categorías falla, continuamos con el historial local
  }

  const progresoInfante = historial[infantId] || {};

  // Si el infante ya tiene registros, sincronizamos con las categorías del sistema
  if (Object.keys(progresoInfante).length > 0) {
    const mapa = { ...progresoInfante };

    // Agregar categorías del sistema que aún no tengan intentos
    categoriasSistema.forEach((cat) => {
      if (!mapa[cat.id]) {
        mapa[cat.id] = {
          id: cat.id,
          nombre: cat.categoryName,
          correctas: 0,
          totales: 0,
          color: cat.color,
        };
      }
    });

    return Object.values(mapa);
  }

  // Si no tiene registros previos para este infante:
  if (categoriasSistema.length > 0) {
    const inicial = categoriasSistema.map((cat) => ({
      id: cat.id,
      nombre: cat.categoryName,
      correctas: 0,
      totales: 0,
      color: cat.color,
    }));
    return inicial;
  }

  // Categorías base por defecto si no hay conexión
  return [
    { id: '1', nombre: 'Alimentación', correctas: 0, totales: 0 },
    { id: '2', nombre: 'Animales', correctas: 0, totales: 0 },
    { id: '3', nombre: 'Higiene', correctas: 0, totales: 0 },
    { id: '4', nombre: 'Emociones', correctas: 0, totales: 0 },
  ];
}

/**
 * Permite reiniciar el progreso acumulado de un infante en el frontend.
 */
export function reiniciarProgresoInfante(infantId: string): void {
  const historial = leerHistorial();
  if (historial[infantId]) {
    delete historial[infantId];
    guardarHistorial(historial);
  }
}
