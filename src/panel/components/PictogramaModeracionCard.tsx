import { Trash2, RotateCcw, Globe, Lock } from 'lucide-react';
import type { AdminPictogram } from '../types/adminPictogram';

interface PictogramaModeracionCardProps {
  pictogram: AdminPictogram;
  onDelete: (id: string, name: string) => void;
  onRestore: (id: string) => void;
}

export function PictogramaModeracionCard({
  pictogram,
  onDelete,
  onRestore,
}: PictogramaModeracionCardProps) {
  const isDeleted = pictogram.isDeleted;
  const fullName = `${pictogram.authorFirstName} ${pictogram.authorLastName}`.trim();

  return (
    <div
      className={`relative bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
        isDeleted
          ? 'border-gray-200 opacity-60 bg-gray-50'
          : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Badge Pública / Privada en la esquina */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {isDeleted ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-700 text-white">
            Eliminado
          </span>
        ) : pictogram.isPublic ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Globe className="w-3 h-3" />
            Pública
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Lock className="w-3 h-3" />
            Privada
          </span>
        )}
      </div>

      {/* Imagen más compacta */}
      <div className="relative w-full h-28 bg-gray-50 flex items-center justify-center p-2 overflow-hidden border-b border-gray-100">
        <img
          src={pictogram.imageUrl}
          alt={pictogram.name}
          className={`max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105 ${
            isDeleted ? 'grayscale blur-xs' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/150x150/e2e8f0/64748b?text=Sin+Imagen';
          }}
        />
      </div>

      {/* Información del pictograma */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Nombre y Categoría */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="text-sm font-bold text-gray-900 truncate" title={pictogram.name}>
              {pictogram.name}
            </h3>
            
          </div>
          <div>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
              {pictogram.category}
            </span>
          </div>
          {/* Creador: Nombre y apellido + Correo abajo */}
          <div className="mt-2 text-xs space-y-0.5 border-t border-gray-100 pt-2">
            <p className="text-gray-800 font-semibold truncate" title={fullName}>
              {fullName}
            </p>
            <p className="text-gray-500 text-[11px] truncate" title={pictogram.authorEmail}>
              {pictogram.authorEmail}
            </p>
          </div>
        </div>

        {/* Botón de acción (Solo Borrar o Restaurar) */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          {isDeleted ? (
            <button
              onClick={() => onRestore(pictogram.id)}
              className="w-full py-1.5 px-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar
            </button>
          ) : (
            <button
              onClick={() => onDelete(pictogram.id, pictogram.name)}
              className="w-full py-1.5 px-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Borrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PictogramaModeracionCard;
