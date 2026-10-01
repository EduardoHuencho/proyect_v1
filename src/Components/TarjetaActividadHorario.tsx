import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import type { ActividadRutinaVista } from '../types/horario';

interface TarjetaActividadHorarioProps {
  actividad: ActividadRutinaVista;
  onOpcionesClick: (actividad: ActividadRutinaVista) => void;
}

export function TarjetaActividadHorario({
  actividad,
  onOpcionesClick,
}: TarjetaActividadHorarioProps) {
  return (
    <div className="w-full bg-white rounded-2xl border-2 border-gray-200/80 p-2.5 flex flex-col items-center justify-between gap-1.5 shadow-xs hover:shadow-md transition-all group relative">
      <button
        type="button"
        onClick={() => onOpcionesClick(actividad)}
        className="absolute top-2 right-2 text-gray-400 hover:text-[#1B3A5C] p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors z-10"
        title="Opciones de actividad"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs sm:text-sm" />
      </button>

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-center shrink-0 overflow-hidden mt-1">
        {actividad.pictogram?.pictoImageUrl && (
          <img
            src={actividad.pictogram.pictoImageUrl}
            alt={actividad.name}
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
          />
        )}
      </div>

      <div className="w-full text-center px-1 overflow-hidden">
        <span className="font-extrabold text-xs sm:text-sm text-[#1B3A5C] truncate block leading-snug">
          {actividad.name || actividad.pictogram?.pictogramName}
        </span>
      </div>
    </div>
  );
}