import AvatarDefault from '../assets/panda.png';

interface PictogramaCardProps {
  pictogramName: string;
  pictoImageUrl: string;
  backgroundColor?: string;
  onClick: () => void;
}

function PictogramaCard({
  pictogramName,
  pictoImageUrl,
  backgroundColor,
  onClick,
}: PictogramaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={backgroundColor ? { backgroundColor } : undefined}
      className={`flex flex-col items-center justify-between p-2 md:p-3 rounded-2xl md:rounded-3xl border border-neutral-200/80 shadow-sm ${
        backgroundColor ? '' : 'bg-amber-100 hover:bg-amber-150'
      } hover:border-neutral-300 hover:shadow-md w-full h-28 sm:h-32 md:h-40 transition-all active:scale-95 overflow-hidden cursor-pointer`}
    >
      <div className="w-full h-16 sm:h-20 md:h-24 bg-white/75 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shrink-0 pt-1 shadow-2xs border-2 border-black">
        <img
          src={pictoImageUrl || AvatarDefault}
          alt={pictogramName}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-0.5 md:p-1"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = 'https://placehold.co/150x150?text=imagen';
          }}
        />
      </div>

      <span className="text-[11px] sm:text-xs md:text-sm font-bold text-neutral-800 leading-tight wrap-break-words hyphens-auto w-full text-center shrink-0 px-1 mb-1 line-clamp-2">
        {pictogramName}
      </span>
    </button>
  );
}

export default PictogramaCard;