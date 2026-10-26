import { Sun, Sunset, Moon } from 'lucide-react';
import type { ActividadRutinaVista, JornadaBackend } from '../types/horario';

interface PlantillaJornadaProps {
  nombreInfante: string;
  diaNumero: number;
  diaNombre: string;
  jornada: JornadaBackend;
  actividades: ActividadRutinaVista[];
}

const INFO_JORNADA: Record<JornadaBackend, { etiqueta: string; Icono: typeof Sun }> = {
  MORNING: { etiqueta: 'Mañana', Icono: Sun },
  AFTERNOON: { etiqueta: 'Tarde', Icono: Sunset },
  NIGHT: { etiqueta: 'Noche', Icono: Moon },
};

export function PlantillaJornada({
  nombreInfante,
  diaNumero,
  diaNombre,
  jornada,
  actividades,
}: PlantillaJornadaProps) {
  const info = INFO_JORNADA[jornada] || INFO_JORNADA.MORNING;
  const IconoJornada = info.Icono;

  const actividadesJornada = actividades
    .filter((a) => a.dayOfWeek === diaNumero && a.stage === jornada)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="p-4 bg-white text-black w-full max-w-5xl mx-auto print:p-0 print:max-w-none font-sans">
      {/* Cabecera optimizada */}
      <div className="border-b-2 border-slate-800 pb-3 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800">
            <IconoJornada className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
              {diaNombre} · {info.etiqueta}
            </h1>
            <p className="text-xs text-slate-500 font-bold">Planificación de Rutina Diaria</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-extrabold text-lg sm:text-xl text-slate-900">{nombreInfante}</span>
        </div>
      </div>

      {/* Secuencia de actividades */}
      {actividadesJornada.length === 0 ? (
        <div className="w-full border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center my-8">
          <p className="font-extrabold text-slate-400 text-lg">
            No hay actividades programadas para este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-3 gap-4">
          {actividadesJornada.map((act, idx) => (
            <div
              key={act.id}
              className="border-2 border-slate-300 rounded-2xl p-3.5 flex flex-col items-center text-center bg-white shadow-xs relative justify-between"
            >
              {/* Indicador de paso */}
              <div className="w-full flex justify-start mb-2">
                <span className="bg-slate-800 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
                  Paso {idx + 1}
                </span>
              </div>

              {/* Contenedor del pictograma con el color de su categoría */}
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-slate-300 flex items-center justify-center p-2 mb-2 bg-slate-50 shrink-0"
                style={act.pictogram?.category?.color ? { backgroundColor: act.pictogram.category.color } : undefined}
              >
                {act.pictogram?.pictoImageUrl ? (
                  <div className="w-full h-full bg-white/80 rounded-xl flex items-center justify-center p-1">
                    <img
                      src={act.pictogram.pictoImageUrl}
                      alt={act.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Sin imagen</span>
                )}
              </div>

              {/* Nombre de la actividad */}
              <span className="font-black text-xs sm:text-sm text-slate-900 leading-tight block truncate w-full mt-1">
                {act.name || act.pictogram?.pictogramName || 'Actividad'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

