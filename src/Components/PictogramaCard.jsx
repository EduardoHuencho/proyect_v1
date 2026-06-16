import React from 'react'

function PictogramaCard({ label, icon, color, star, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 border border-neutral-300 shadow rounded-2xl ${color}
      hover:shadow-lg hover:border-neutral-400 aspect-[5/4] relative transition-all active:scale-95`}
    >
      {star && (
        <span className="absolute top-1.5 right-1.5 text-amber-500 text-sm">⭐</span>
      )}
      <span className="text-5xl">{icon}</span>
      <span className="text-sm font-semibold mt-2 truncate w-full text-center text-neutral-900">
        {label}
      </span >
    </button>
  )
}

export default PictogramaCard