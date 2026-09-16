import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPictogram, getPictograms } from '../services/pictogramsService';
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
  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);
  const [loadingPictogramas, setLoadingPictogramas] = useState(false);
  const [errorPictogramas, setErrorPictogramas] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      setPictogramas([]);
      setErrorPictogramas(null);
      setLoadingPictogramas(false);
    }
  }, [userId, token]);

  const cargarPictogramas = useCallback(async () => {
    if (!userId || !token) return;

    setLoadingPictogramas(true);
    setErrorPictogramas(null);

    try {
      const data = await getPictograms(token);
      setPictogramas(data);
    } catch (error) {
      console.error('Error al cargar pictogramas:', error);
      setErrorPictogramas('No se pudieron sincronizar los pictogramas personalizados');
      setPictogramas([]);
    } finally {
      setLoadingPictogramas(false);
    }
  }, [userId, token]);

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

  const value = useMemo<PictogramasContextValue>(() => ({
    pictogramas,
    loadingPictogramas,
    errorPictogramas,
    cargarPictogramas,
    crearPictograma,
  }), [pictogramas, loadingPictogramas, errorPictogramas, cargarPictogramas, crearPictograma]);

  return <PictogramaContext.Provider value={value}>{children}</PictogramaContext.Provider>;
}

export function usePictogramas(): PictogramasContextValue {
  const context = useContext(PictogramaContext);
  if (!context) throw new Error('usePictogramas debe usarse dentro de un PictogramaProvider');
  return context;
}