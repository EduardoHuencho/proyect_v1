import React from 'react'
import { useNavigate } from 'react-router'

const modulos = [
  {
    id: 'horario',
    titulo: 'HORARIO',
    emoji: '📅',
    borderColor: '#1E88E5',
    disponible: false,
  },
  {
    id: 'pictogramas',
    titulo: 'PICTOGRAMAS',
    emoji: '🖼️',
    borderColor: '#FDD835',
    disponible: true,
    ruta: '/pictogramas',
  },
  {
    id: 'juegos',
    titulo: 'JUEGOS',
    emoji: '🎲',
    borderColor: '#E91E8C',
    disponible: false,
  },
]

function Page2() {
  const navigate = useNavigate()

  const handleModulo = (modulo) => {
    if (!modulo.disponible) return
    navigate(modulo.ruta)
  }

  return (
    <div
      className="min-h-screen bg-[#E0F7FA] font-sans pb-10"
      style={{
        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.05) 1.5px, transparent 0)',
        backgroundSize: '22px 22px',
      }}
    >
      <nav className="bg-[#1B3A5C] px-6 py-4 flex items-center justify-between shadow-md">
        <span className="font-extrabold text-2xl tracking-wide text-white">TEAYUDO</span>
        <button
          onClick={() => navigate('/')}
          className="bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-6 py-2 rounded-xl font-bold transition-all"
        >
          Salir
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mb-4 bg-[#FDD835] border-4 border-white shadow-lg">
          👧
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-8 text-center">
          ¡Hola, Sofía!
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <button
              key={modulo.id}
              onClick={() => handleModulo(modulo)}
              className={`bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 shadow-md transition-all border-[4px]
                ${modulo.disponible 
                  ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-lg' 
                  : 'opacity-60 cursor-not-allowed'
                }`}
              style={{ borderColor: modulo.borderColor }}
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl"
                style={{ background: modulo.borderColor + '33' }}
              >
                {modulo.emoji}
              </div>
              
              <div className="text-center w-full">
                <p className="font-extrabold text-[#1B3A5C] text-2xl break-words">
                  {modulo.titulo}
                </p>
                {!modulo.disponible && (
                  <p className="text-lg text-[#78909C] font-semibold mt-1">
                    Próximamente
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page2