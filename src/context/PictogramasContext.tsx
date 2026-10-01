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
  const { ninoActivo, tutorAutenticado } = useNino();
  
  const hayCredenciales = Boolean(userId && token);

  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);
  const [loadingPictogramas, setLoadingPictogramas] = useState(false);
  const [errorPictogramas, setErrorPictogramas] = useState<string | null>(null);

  const ninoActivoId = ninoActivo?.id;

  const cargarPictogramas = useCallback(async () => {
    if (!userId || !token) return;

    setLoadingPictogramas(true);
    setErrorPictogramas(null);

    try {
      if (tutorAutenticado && ninoActivoId) {
        const privados = await getPictogramsByInfantId(ninoActivoId, token);
        setPictogramas(privados);
      } else {
        const [publicos, privados] = await Promise.all([
          getPictograms(token),
          ninoActivoId ? getPictogramsByInfantId(ninoActivoId, token) : Promise.resolve([] as Pictograma[]),
        ]);

        const mapaFinal = new Map<string, Pictograma>();
        for (const p of publicos) mapaFinal.set(p.id, p);
        for (const p of privados) mapaFinal.set(p.id, p);
        setPictogramas(Array.from(mapaFinal.values()));
      }
    } catch (error) {
      console.error('Error al cargar pictogramas:', error);
      setErrorPictogramas('No se pudieron sincronizar los pictogramas personalizados');
      setPictogramas([]);
    } finally {
      setLoadingPictogramas(false);
    }
  }, [userId, token, tutorAutenticado, ninoActivoId]);

  const crearPictograma = useCallback(async (input: CrearPictogramaInput) => {
    if (!userId || !token) throw new Error('NO_TUTOR_SESSION');

    const infantId = input.infantId || ninoActivoId;

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
  }, [userId, token, ninoActivoId, cargarPictogramas]);

  const value = useMemo<PictogramasContextValue>(() => ({
    pictogramas: hayCredenciales ? pictogramas : [],
    loadingPictogramas,
    errorPictogramas: hayCredenciales ? errorPictogramas : null,
    cargarPictogramas,
    crearPictograma,
  }), [hayCredenciales, pictogramas, loadingPictogramas, errorPictogramas, cargarPictogramas, crearPictograma]);

  return <PictogramaContext.Provider value={value}>{children}</PictogramaContext.Provider>;
}

export function usePictogramas(): PictogramasContextValue {
  const context = useContext(PictogramaContext);
  if (!context) throw new Error('usePictogramas debe usarse dentro de un PictogramaProvider');
  return context;
}