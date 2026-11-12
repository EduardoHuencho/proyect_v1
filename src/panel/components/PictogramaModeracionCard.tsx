import { Trash2, Globe, Lock } from 'lucide-react';
import type { AdminPictogram } from '../types/adminPictogram';

interface PictogramaModeracionCardProps {
  pictogram: AdminPictogram;
  onDelete: (pictogram: AdminPictogram) => void;
}

export function PictogramaModeracionCard({
  pictogram,
  onDelete,
}: PictogramaModeracionCardProps) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between">
      <div className="absolute top-2 right-2 z-10">
        {pictogram.isPublic ? (
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

      <div className="relative w-full h-28 bg-gray-50 flex items-center justify-center p-2 overflow-hidden border-b border-gray-100">
        <img
          src={pictogram.imageUrl}
          alt={pictogram.name}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/150x150/e2e8f0/64748b?text=Sin+Imagen';
          }}
        />
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="text-sm font-bold text-gray-900 truncate" title={pictogram.name}>
              {pictogram.name}
            </h3>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
              {pictogram.category}
            </span>
          </div>

          {pictogram.description && (
            <p
              className="text-xs text-gray-500 line-clamp-2 mt-1"
              title={pictogram.description}
            >
              {pictogram.description}
            </p>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => onDelete(pictogram)}
            className="w-full py-1.5 px-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PictogramaModeracionCard;
