import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NinoContext = createContext(null);

export function NinoProvider({ children }) {
  const { userId, token } = useAuth();

  const [ninos, setNinos] = useState([]);
  const [loadingNinos, setLoadingNinos] = useState(false);
  
  const [ninoActivo, setNinoActivoState] = useState(() => {
    const guardado = localStorage.getItem('ninoActivo');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [tutorAutenticado, setTutorAutenticado] = useState(false);
  const [tutorOrigen, setTutorOrigen] = useState(null);

  const setNinoActivo = useCallback((nino) => {
    if (nino) {
      localStorage.setItem('ninoActivo', JSON.stringify(nino));
    } else {
      localStorage.removeItem('ninoActivo');
    }
    setNinoActivoState(nino);
  }, []);

  const cargarNinos = useCallback(async (idPadre = userId) => {
    if (!idPadre) return [];

    try {
      setLoadingNinos(true);
      const response = await fetch(`http://localhost:3000/user/${idPadre}/infants`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP_ERROR_${response.status}`);
      }

      const data = await response.json();
      let lista = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (Array.isArray(data.infants)) {
        lista = data.infants;
      } else if (Array.isArray(data.data)) {
        lista = data.data;
      } else if (data && typeof data === 'object' && data.id) {
        lista = [data];
      }

      setNinos(lista);
      return lista;
    } catch (err) {
      console.error('Error al cargar lista de infantes:', err);
      setNinos([]);
      return [];
    } finally {
      setLoadingNinos(false);
    }
  }, [userId, token]);

  const value = useMemo(
    () => ({
      ninos,
      loadingNinos,
      cargarNinos,
      ninoActivo,
      setNinoActivo,
      tutorAutenticado,
      setTutorAutenticado,
      tutorOrigen,
      setTutorOrigen,
    }),
    [ninos, loadingNinos, cargarNinos, ninoActivo, setNinoActivo, tutorAutenticado, tutorOrigen]
  );

  return <NinoContext.Provider value={value}>{children}</NinoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNino() {
  const context = useContext(NinoContext);
  if (!context) {
    throw new Error('useNino debe ser utilizado dentro de un NinoProvider');
  }
  return context;
}