import React from 'react';

function PictogramaCard({ label, icon, color, star, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-between p-3 border border-neutral-300 shadow rounded-2xl ${color}
      hover:shadow-lg hover:border-neutral-400 aspect-[5/4] relative transition-all active:scale-95`}
    >
      {star && (
        <span className="absolute top-1.5 right-1.5 text-amber-500 text-sm z-10">
          ⭐
        </span>
      )}

      <div className="flex-grow flex items-center justify-center w-full h-[65%] overflow-hidden mt-1">
        <img
          src={icon}
          alt={label}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/150x150?text=🖼️';
          }}
        />
      </div>

      <span className="text-sm font-semibold truncate w-full text-center text-neutral-900 mt-1 shrink-0">
        {label}
      </span>
    </button>
  );
}

export default PictogramaCard;
