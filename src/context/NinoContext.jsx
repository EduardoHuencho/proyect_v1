import { createContext, useContext, useMemo, useState } from 'react';

const NinoContext = createContext();

export function NinoProvider({ children }) {
  const [ninoActivo, setNinoActivo] = useState(null);
  const [tutorAutenticado, setTutorAutenticado] = useState(false);
  const [tutorOrigen, setTutorOrigen] = useState(null);
  const value = useMemo(
    () => ({
      ninoActivo,
      setNinoActivo,
      tutorAutenticado,
      setTutorAutenticado,
      tutorOrigen,
      setTutorOrigen,
    }),
    [ninoActivo, tutorAutenticado, tutorOrigen]
  );

  return (
    <NinoContext.Provider value={value}>
      {children}
    </NinoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNino() {
  return useContext(NinoContext);
}
