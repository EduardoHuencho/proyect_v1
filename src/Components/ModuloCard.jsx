import React from 'react'

function ModuloCard({ 
  titulo, 
  descripcion, 
  imagen, 
  borderColor, 
  disponible, 
  onClick, 
  variante = 'nino' 
}) {
  
  if (variante === 'nino') {
    return (
      <button
        onClick={onClick}
        className={`bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 shadow-md transition-all border-[4px] min-h-[220px] w-full
          ${disponible 
            ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-lg' 
            : 'opacity-50 cursor-not-allowed'
          }`}
        style={{ borderColor: borderColor }}
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center p-3"
          style={{ background: borderColor + '22' }}
        >
          <img src={imagen} alt={titulo} className="w-full h-full object-contain" />
        </div>
        
        <div className="text-center w-full">
          <p className="font-extrabold text-[#1B3A5C] text-2xl break-words uppercase tracking-wide">
            {titulo}
          </p>
          {!disponible && (
            <p className="text-base text-[#78909C] font-semibold mt-1">
              Próximamente
            </p>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-3xl p-6 flex flex-col items-center justify-center gap-4 shadow-md transition-all min-h-[180px] w-full text-white
        ${disponible 
          ? 'hover:scale-[1.02] hover:brightness-105 active:scale-[0.99] cursor-pointer' 
          : 'opacity-60 cursor-not-allowed'
        }`}
      style={{ backgroundColor: borderColor }}
    >

      <div className="w-20 h-20 bg-white/95 rounded-2xl flex items-center justify-center p-3 shadow-sm flex-shrink-0">
        <img 
          src={imagen} 
          alt={titulo} 
          className="w-full h-full object-contain" 
        />
      </div>
      
      <div className="text-center w-full">
        <h2 className="font-extrabold text-xl md:text-2xl tracking-wide leading-tight">
          {titulo}
        </h2>
        {descripcion && (
          <p className="text-sm text-white/80 font-medium mt-1 px-2 leading-snug break-words">
            {descripcion}
          </p>
        )}
        {!disponible && (
          <p className="text-xs bg-black/10 rounded-full px-3 py-1 inline-block text-white/90 font-bold mt-2">
            Próximamente
          </p>
        )}
      </div>
    </button>
  )
}

export default ModuloCard