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
      className={`w-full aspect-square p-2 rounded-2xl border-2 flex flex-col items-center justify-between transition-all cursor-pointer relative group overflow-hidden ${
        seleccionado
          ? 'border-[#1B3A5C] bg-[#E0F7FA] shadow-sm'
          : 'border-gray-200 hover:border-amber-400 bg-white hover:shadow-xs'
      }`}
    >
      {seleccionado && (
        <div className="absolute top-1.5 right-1.5 bg-[#1B3A5C] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow-xs z-10">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}

      <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
        <img
          src={pictograma.pictoImageUrl}
          alt={pictograma.pictogramName}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      <span className="text-[11px] font-extrabold text-[#1B3A5C] truncate w-full text-center mt-1">
        {pictograma.pictogramName}
      </span>
    </button>
  );
}