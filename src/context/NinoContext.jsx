import { createContext, useContext, useState } from 'react'

const NinoContext = createContext()

export function NinoProvider({ children }) {
  const [ninoActivo, setNinoActivo] = useState(null)
  const [tutorAutenticado, setTutorAutenticado] = useState(false)
  const [tutorOrigen, setTutorOrigen] = useState(null) 

  return (
    <NinoContext.Provider value={{ ninoActivo, setNinoActivo, tutorAutenticado, setTutorAutenticado, tutorOrigen, setTutorOrigen }}>
      {children}
    </NinoContext.Provider>
  )
}

export function useNino() {
  return useContext(NinoContext)
}