import React from 'react'
import fondoImg from '../assets/diseño.jpg'

function Fondo({ children }) {
  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundImage: `url(${fondoImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  )
}

export default Fondo