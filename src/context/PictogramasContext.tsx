import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPictogram, getPictograms, getPictogramsByInfantId } from '../services/pictogramsService';
import type { CrearPictogramaInput, Pictograma } from '../types/pictograma';
import { useAuth } from './AuthContext';
import { useNino } from './NinoContext';

interface PictogramasContextValue {
  pictogramas: Pictograma[];
  loadingPictogramas: boolean;
  errorPictogramas: string | null;
  cargarPictogramas: () => Promise<void>;
  crearPictograma: (input: CrearPictogramaInput) => Promise<void>;
}

const PictogramaContext = createContext<PictogramasContextValue | null>(null);

export function PictogramaProvider({ children }: { children: React.ReactNode }) {
  const { userId, token } = useAuth();
  const { ninoActivo } = useNino();
  
  const hayCredenciales = Boolean(userId && token);

  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);
  const [loadingPictogramas, setLoadingPictogramas] = useState(false);
  const [errorPictogramas, setErrorPictogramas] = useState<string | null>(null);

  const pictogramasFinales = hayCredenciales ? pictogramas : [];
  const errorFinal = hayCredenciales ? errorPictogramas : null;

  const cargarPictogramas = useCallback(async () => {
    if (!userId || !token) return;

    setLoadingPictogramas(true);
    setErrorPictogramas(null);

    try {
      // Petición 1: pictogramas públicos
      // Petición 2: pictogramas privados del infante activo (si hay uno seleccionado)
      const infantId = ninoActivo?.id;
      const [publicos, privados] = await Promise.all([
        getPictograms(token),
        infantId ? getPictogramsByInfantId(infantId, token) : Promise.resolve([] as Pictograma[]),
      ]);

      // Combinar y deduplicar por id (los privados prevalecen en caso de duplicado)
      const mapaFinal = new Map<string, Pictograma>();
      for (const p of publicos) mapaFinal.set(p.id, p);
      for (const p of privados) mapaFinal.set(p.id, p);

      setPictogramas(Array.from(mapaFinal.values()));
    } catch (error) {
      console.error('Error al cargar pictogramas:', error);
      setErrorPictogramas('No se pudieron sincronizar los pictogramas personalizados');
      setPictogramas([]);
    } finally {
      setLoadingPictogramas(false);
    }
  }, [userId, token, ninoActivo?.id]);

  /*
  const crearPictograma = useCallback(async (input: CrearPictogramaInput) => {
    if (!userId || !token) throw new Error('NO_TUTOR_SESSION');

    const infantId = input.infantId || ninoActivo?.id;
    if (!infantId) throw new Error('NO_INFANT_SELECTED');

    setLoadingPictogramas(true);
    setErrorPictogramas(null);

    try {
      await createPictogram({
        ...input,
        userId: input.userId || userId,
        infantId,
      }, token);

      await cargarPictogramas();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar pictograma';
      setErrorPictogramas(message);
      throw error;
    } finally {
      setLoadingPictogramas(false);
    }
  }, [userId, token, ninoActivo?.id, cargarPictogramas]);
  */

  // PictogramaContext.tsx

const crearPictograma = useCallback(async (input: CrearPictogramaInput) => {
  if (!userId || !token) throw new Error('NO_TUTOR_SESSION');

  const infantId = input.infantId || ninoActivo?.id;

  if (!infantId) {
    throw new Error('NO_INFANT_SELECTED');
  }

  setLoadingPictogramas(true);
  setErrorPictogramas(null);

  try {
    await createPictogram({
      ...input,
      userId: input.userId || userId,
      infantId: infantId,
    }, token);

    await cargarPictogramas();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar pictograma';
    setErrorPictogramas(message);
    throw error;
  } finally {
    setLoadingPictogramas(false);
  }
}, [userId, token, ninoActivo?.id, cargarPictogramas]);

  const value = useMemo<PictogramasContextValue>(() => ({
    pictogramas: pictogramasFinales,
    loadingPictogramas,
    errorPictogramas: errorFinal,
    cargarPictogramas,
    crearPictograma,
  }), [pictogramasFinales, loadingPictogramas, errorFinal, cargarPictogramas, crearPictograma]);

  return <PictogramaContext.Provider value={value}>{children}</PictogramaContext.Provider>;
}

export function usePictogramas(): PictogramasContextValue {
  const context = useContext(PictogramaContext);
  if (!context) throw new Error('usePictogramas debe usarse dentro de un PictogramaProvider');
  return context;
}