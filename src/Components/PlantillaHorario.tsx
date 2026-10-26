import { Sun, Sunset, Moon } from 'lucide-react';
import type { ActividadRutinaVista } from '../types/horario';

const DIAS = [
  { numero: 1, abrev: 'Lunes' },
  { numero: 2, abrev: 'Martes' },
  { numero: 3, abrev: 'Miércoles' },
  { numero: 4, abrev: 'Jueves' },
  { numero: 5, abrev: 'Viernes' },
  { numero: 6, abrev: 'Sábado' },
  { numero: 7, abrev: 'Domingo' },
];

const BLOQUES = [
  { stage: 'MORNING', icon: Sun },
  { stage: 'AFTERNOON', icon: Sunset },
  { stage: 'NIGHT', icon: Moon },
];

interface PlantillaHorarioProps {
  nombreInfante: string;
  actividades: ActividadRutinaVista[];
}

export function PlantillaHorario({ nombreInfante, actividades }: PlantillaHorarioProps) {
  return (
    <div className="p-3 bg-white text-black w-full max-w-6xl mx-auto print:p-0 print:max-w-none font-sans">
      <div className="border-b-2 border-slate-800 pb-2 mb-3 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Planificación Semanal
        </h1>
        <div className="text-right">
          <span className="font-extrabold text-lg sm:text-xl text-slate-900">{nombreInfante}</span>
        </div>
      </div>

      <div className="w-full border-2 border-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[48px_repeat(7,1fr)] bg-slate-800 text-white text-center font-extrabold text-xs py-2 border-b border-slate-800">
          <div className="border-r border-slate-600"></div>
          {DIAS.map((d) => (
            <div key={d.numero} className="border-r border-slate-600 last:border-none">
              {d.abrev}
            </div>
          ))}
        </div>

        {BLOQUES.map((bloque) => {
          const Icono = bloque.icon;
          return (
            <div
              key={bloque.stage}
              className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-slate-300 last:border-none min-h-32 print:min-h-28"
            >
              <div className="flex items-center justify-center bg-slate-100 border-r border-slate-300 p-2 text-slate-700">
                <Icono className="w-5 h-5" strokeWidth={2.2} />
              </div>

              {DIAS.map((dia) => {
                const actividadesCelda = actividades.filter(
                  (a) => a.dayOfWeek === dia.numero && a.stage === bloque.stage
                ).sort((a, b) => a.position - b.position);

                return (
                  <div
                    key={dia.numero}
                    className="p-1 border-r border-slate-200 last:border-none flex flex-col gap-1 items-center justify-start bg-white"
                  >
                    {actividadesCelda.map((act) => (
                      <div
                        key={act.id}
                        className="w-full border border-slate-300 rounded-lg p-1 flex flex-col items-center text-center bg-slate-50 print:bg-white"
                        style={act.pictogram?.category?.color ? { backgroundColor: act.pictogram.category.color } : undefined}
                      >
                        {act.pictogram?.pictoImageUrl && (
                          <div className="w-8 h-8 bg-white/80 rounded flex items-center justify-center p-0.5 mb-0.5">
                            <img
                              src={act.pictogram.pictoImageUrl}
                              alt={act.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="font-extrabold text-[10px] text-slate-900 leading-tight block truncate w-full">
                          {act.name || act.pictogram?.pictogramName || 'Actividad'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}