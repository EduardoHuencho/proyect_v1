import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getInfants } from '../services/infantsService';
import type { Infante } from '../types/perfil';
import { useAuth } from './AuthContext';

interface NinoContextValue {
  ninos: Infante[];
  loadingNinos: boolean;
  cargarNinos: (userId?: string) => Promise<Infante[]>;
  ninoActivo: Infante | null;
  setNinoActivo: (nino: Infante | null) => void;
  tutorAutenticado: boolean;
  setTutorAutenticado: React.Dispatch<React.SetStateAction<boolean>>;
  tutorOrigen: 'global' | 'local' | null;
  setTutorOrigen: React.Dispatch<React.SetStateAction<'global' | 'local' | null>>;
}

const NinoContext = createContext<NinoContextValue | null>(null);

/*
function obtenerNinoGuardado(): Infante | null {
  try {
    const item = localStorage.getItem('ninoActivo');
    return item ? (JSON.parse(item) as Infante) : null;
  } catch {
    localStorage.removeItem('ninoActivo');
    return null;
  }
}
*/
function obtenerNinoGuardado(): Infante | null {
  try {
    const item = localStorage.getItem('ninoActivo');
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.id) {
      return parsed as Infante;
    }
    
    localStorage.removeItem('ninoActivo');
    return null;
  } catch {
    localStorage.removeItem('ninoActivo');
    return null;
  }
}

export function NinoProvider({ children }: { children: React.ReactNode }) {
  const { userId, token } = useAuth();
  
  const hayCredenciales = Boolean(userId && token);

  const [ninos, setNinos] = useState<Infante[]>([]);
  const [loadingNinos, setLoadingNinos] = useState(false);
  const [ninoActivoState, setNinoActivoState] = useState<Infante | null>(obtenerNinoGuardado);
  const [tutorAutenticado, setTutorAutenticado] = useState(false);
  const [tutorOrigen, setTutorOrigen] = useState<'global' | 'local' | null>(null);

  const ninoActivo = hayCredenciales ? ninoActivoState : null;
  const activoTutor = hayCredenciales ? tutorAutenticado : false;
  const origenTutor = hayCredenciales ? tutorOrigen : null;

  /*
  const setNinoActivo = useCallback((nino: Infante | null) => {
    if (nino) localStorage.setItem('ninoActivo', JSON.stringify(nino));
    else localStorage.removeItem('ninoActivo');
    setNinoActivoState(nino);
  }, []);
  */

  const setNinoActivo = useCallback((nino: Infante | null) => {
    if (nino && nino.id) {
      localStorage.setItem('ninoActivo', JSON.stringify(nino));
    } else {
      localStorage.removeItem('ninoActivo');
    }
    setNinoActivoState(nino);
  }, []);

  const cargarNinos = useCallback(async (idPadre?: string) => {
    const id = idPadre ?? userId;
    
    if (!id || !token) return [];

    setLoadingNinos(true);
    try {
      const lista = await getInfants(id, token);
      setNinos(lista);
      return lista;
    } catch (error) {
      console.error('Error al cargar lista de infantes:', error);
      setNinos([]);
      return [];
    } finally {
      setLoadingNinos(false);
    }
  }, [userId, token]);

  const value = useMemo<NinoContextValue>(() => ({
    ninos: hayCredenciales ? ninos : [],
    loadingNinos,
    cargarNinos,
    ninoActivo,
    setNinoActivo,
    tutorAutenticado: activoTutor,
    setTutorAutenticado,
    tutorOrigen: origenTutor,
    setTutorOrigen,
  }), [hayCredenciales, ninos, loadingNinos, cargarNinos, ninoActivo, setNinoActivo, activoTutor, origenTutor]);

  return <NinoContext.Provider value={value}>{children}</NinoContext.Provider>;
}

export function useNino(): NinoContextValue {
  const context = useContext(NinoContext);
  if (!context) throw new Error('useNino debe ser utilizado dentro de un NinoProvider');
  return context;
}