function PictogramaCard({ label, icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-between p-2 md:p-3 rounded-2xl md:rounded-3xl border border-neutral-200/80 shadow-sm ${color} hover:shadow-md hover:border-neutral-300 w-full h-28 sm:h-32 md:h-40 transition-transform active:scale-95 overflow-hidden`}
    >
      
      <div className="w-full h-16 sm:h-20 md:h-24 flex items-center justify-center overflow-hidden shrink-0 pt-1">
        <img
          src={icon}
          alt={label}
          className="h-full w-full object-contain p-0.5 md:p-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/150x150?text=🖼️';
          }}
        />
      </div>

      <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-neutral-800 leading-tight wrap-break-words hyphens-auto w-full text-center shrink-0 px-1 mb-1 line-clamp-2">
        {label}
      </span>
    </button>
  );
}

export default PictogramaCard;