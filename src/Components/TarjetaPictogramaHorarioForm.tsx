import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { Pictograma } from '../types/pictograma';

interface TarjetaPictogramaHorarioFormProps {
  pictograma: Pictograma;
  seleccionado?: boolean;
  onClick?: (pictograma: Pictograma) => void;
}

export function TarjetaPictogramaHorarioForm({
  pictograma,
  seleccionado = false,
  onClick,
}: TarjetaPictogramaHorarioFormProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(pictograma)}
      style={pictograma.category?.color ? { backgroundColor: pictograma.category.color } : undefined}
      className={`w-full h-36 sm:h-40 p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between transition-all cursor-pointer relative group ${
        !pictograma.category?.color ? 'bg-white' : ''
      } shadow-xs hover:shadow-md ${
        seleccionado
          ? 'border-[#1B3A5C] ring-2 ring-[#1B3A5C]'
          : 'border-gray-200 hover:border-[#1B3A5C]/40'
      }`}
    >
      {/* Badge de tipo de pictograma */}
      {pictograma.personal && (
        <span className="absolute top-1.5 left-1.5 bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-amber-300 z-10 shadow-2xs">
          Privado
        </span>
      )}

      {/* Indicador de selección */}
      {seleccionado && (
        <div className="absolute top-1.5 right-1.5 bg-[#1B3A5C] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs z-10">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}

      {/* Contenedor de imagen con dimensiones controladas */}
      <div className="w-full h-22 sm:h-24 bg-white/80 rounded-xl flex items-center justify-center overflow-hidden p-1.5 border border-black/5 shrink-0 shadow-2xs">
        <img
          src={pictograma.pictoImageUrl}
          alt={pictograma.pictogramName}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/150x150?text=imagen';
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Nombre del pictograma hasta 2 líneas para que se lea completo */}
      <span
        title={pictograma.pictogramName}
        className="text-[11px] sm:text-xs font-bold text-[#1B3A5C] text-center w-full leading-tight line-clamp-2 px-1 mt-1 shrink-0"
      >
        {pictograma.pictogramName}
      </span>
    </button>
  );
}