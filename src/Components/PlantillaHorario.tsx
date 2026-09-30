import type { ActividadHorarioBD } from '../types/horario';

const DIAS = [
  { clave: 'LUNES', abrev: 'Lunes' },
  { clave: 'MARTES', abrev: 'Martes' },
  { clave: 'MIÉRCOLES', abrev: 'Miércoles' },
  { clave: 'JUEVES', abrev: 'Jueves' },
  { clave: 'VIERNES', abrev: 'Viernes' },
  { clave: 'SÁBADO', abrev: 'Sábado' },
  { clave: 'DOMINGO', abrev: 'Domingo' },
];

const BLOQUES = [
  { clave: 'MAÑANA', etiqueta: 'Mañana' },
  { clave: 'TARDE', etiqueta: 'Tarde' },
  { clave: 'NOCHE', etiqueta: 'Noche' },
];

const horaABloque = (hora: string): 'MAÑANA' | 'TARDE' | 'NOCHE' => {
  const h = parseInt(hora.split(':')[0], 10);
  if (h < 12) return 'MAÑANA';
  if (h < 18) return 'TARDE';
  return 'NOCHE';
};

interface PlantillaHorarioProps {
  nombreInfante: string;
  actividades: ActividadHorarioBD[];
}

export function PlantillaHorario({ nombreInfante, actividades }: PlantillaHorarioProps) {
  return (
    <div className="p-4 bg-white text-black w-full max-w-6xl mx-auto print:p-0 print:max-w-none font-sans">
      <div className="border-b-2 border-slate-800 pb-3 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            TEAyudo - Planificación Semanal
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Horario de actividades y rutinas visuales
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-bold uppercase">Infante</p>
          <p className="font-extrabold text-lg text-slate-900">{nombreInfante}</p>
        </div>
      </div>

      <div className="w-full border-2 border-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 bg-slate-800 text-white text-center font-extrabold text-xs py-2 border-b border-slate-800">
          <div className="uppercase tracking-wider border-r border-slate-600 flex items-center justify-center">
            BLOQUE
          </div>
          {DIAS.map((d) => (
            <div key={d.clave} className="border-r border-slate-600 last:border-none">
              {d.abrev}
            </div>
          ))}
        </div>

        {BLOQUES.map((bloque) => (
          <div
            key={bloque.clave}
            className="grid grid-cols-8 border-b border-slate-300 last:border-none min-h-40"
          >
            <div className="flex items-center justify-center font-black text-xs text-slate-800 bg-slate-100 border-r border-slate-300 uppercase tracking-wider">
              {bloque.etiqueta}
            </div>

            {DIAS.map((dia) => {
              const actividadesCelda = actividades.filter(
                (a) => a.dayOfWeek === dia.clave && horaABloque(a.hour) === bloque.clave
              );

              return (
                <div
                  key={dia.clave}
                  className="p-1.5 border-r border-slate-200 last:border-none flex flex-col gap-1.5 items-center justify-start bg-white"
                >
                  {actividadesCelda.map((act) => (
                    <div
                      key={act.id}
                      className="w-full border border-slate-300 rounded-lg p-1 flex flex-col items-center text-center bg-slate-50 print:bg-white"
                    >
                      {act.pictogram?.pictoImageUrl && (
                        <img
                          src={act.pictogram.pictoImageUrl}
                          alt={act.pictogram.pictogramName}
                          className="w-8 h-8 object-contain mb-0.5"
                        />
                      )}
                      <span className="font-extrabold text-[10px] text-slate-900 leading-tight block truncate w-full">
                        {act.pictogram?.pictogramName || 'Actividad'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>Generado mediante la plataforma TEAyudo · Sistema CAA</span>
        <span>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
}