import React from 'react';

function CategoriaCard({ label, icon, color, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 border rounded-full text-sm font-bold shadow-sm transition-all shrink-0 active:scale-95 ${
        activo
          ? 'bg-amber-400 text-amber-950 border-amber-500 scale-105'
          : `${color || 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export default CategoriaCard;
