import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import { CalendarDays, Clock, Sun, Sunset, Moon } from 'lucide-react';
import type { JornadaBackend } from '../types/horario';

interface ModalSeleccionImpresionProps {
  isOpen: boolean;
  onClose: () => void;
  diaDefecto?: number;
  jornadaDefecto?: JornadaBackend;
  onConfirmar: (config: {
    modo: 'completo' | 'jornada';
    diaNumero: number;
    diaNombre: string;
    jornada: JornadaBackend;
  }) => void;
}

const DIAS = [
  { numero: 1, abrev: 'Lun', nombre: 'Lunes' },
  { numero: 2, abrev: 'Mar', nombre: 'Martes' },
  { numero: 3, abrev: 'Mié', nombre: 'Miércoles' },
  { numero: 4, abrev: 'Jue', nombre: 'Jueves' },
  { numero: 5, abrev: 'Vie', nombre: 'Viernes' },
  { numero: 6, abrev: 'Sáb', nombre: 'Sábado' },
  { numero: 7, abrev: 'Dom', nombre: 'Domingo' },
];

const JORNADAS: { clave: JornadaBackend; etiqueta: string; Icono: typeof Sun }[] = [
  { clave: 'MORNING', etiqueta: 'Mañana', Icono: Sun },
  { clave: 'AFTERNOON', etiqueta: 'Tarde', Icono: Sunset },
  { clave: 'NIGHT', etiqueta: 'Noche', Icono: Moon },
];

export function ModalSeleccionImpresion({
  isOpen,
  onClose,
  diaDefecto = 1,
  jornadaDefecto = 'MORNING',
  onConfirmar,
}: ModalSeleccionImpresionProps) {
  const [modo, setModo] = useState<'completo' | 'jornada'>('completo');
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(diaDefecto);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<JornadaBackend>(jornadaDefecto);

  if (!isOpen) return null;

  const handleImprimir = () => {
    const diaObj = DIAS.find((d) => d.numero === diaSeleccionado) || DIAS[0];
    onConfirmar({
      modo,
      diaNumero: diaSeleccionado,
      diaNombre: diaObj.nombre,
      jornada: jornadaSeleccionada,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white max-w-md w-full rounded-[35px] p-6 sm:p-7 shadow-2xl relative flex flex-col gap-5 border border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="Cerrar modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>

        <div>
          <h2 className="text-2xl font-black text-[#1B3A5C]">
            Opciones de Impresión
          </h2>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Selecciona el formato que deseas imprimir
          </p>
        </div>

        {/* Opciones de tipo de plantilla */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setModo('completo')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-start gap-2.5 text-left transition-all cursor-pointer ${
              modo === 'completo'
                ? 'bg-[#E0F7FA]/60 border-[#1B3A5C] text-[#1B3A5C] shadow-xs'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              modo === 'completo' ? 'bg-[#1B3A5C] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Horario Semanal</span>
              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                Semana completa con todas las jornadas
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setModo('jornada')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-start gap-2.5 text-left transition-all cursor-pointer ${
              modo === 'jornada'
                ? 'bg-[#E0F7FA]/60 border-[#1B3A5C] text-[#1B3A5C] shadow-xs'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              modo === 'jornada' ? 'bg-[#1B3A5C] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Jornada de un Día</span>
              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                Un momento específico con tarjetas grandes
              </span>
            </div>
          </button>
        </div>

        {/* Si selecciona jornada específica, mostramos los selectores de día y momento */}
        {modo === 'jornada' && (
          <div className="flex flex-col gap-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-200 animate-fadeIn">
            {/* Selector de día */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1B3A5C]">Día de la semana</label>
              <div className="grid grid-cols-7 gap-1">
                {DIAS.map((d) => (
                  <button
                    key={d.numero}
                    type="button"
                    onClick={() => setDiaSeleccionado(d.numero)}
                    className={`py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer text-center ${
                      diaSeleccionado === d.numero
                        ? 'bg-[#1B3A5C] text-white border-[#1B3A5C] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    title={d.nombre}
                  >
                    {d.abrev}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de jornada */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1B3A5C]">Momento de la jornada</label>
              <div className="grid grid-cols-3 gap-2">
                {JORNADAS.map((j) => {
                  const Icono = j.Icono;
                  const activo = jornadaSeleccionada === j.clave;
                  return (
                    <button
                      key={j.clave}
                      type="button"
                      onClick={() => setJornadaSeleccionada(j.clave)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activo
                          ? 'bg-[#1B3A5C] text-white border-[#1B3A5C] shadow-xs'
                          : 'bg-white text-[#1B3A5C] border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icono className="w-4 h-4" />
                      <span>{j.etiqueta}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleImprimir}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#1B3A5C] text-white font-extrabold text-sm hover:bg-[#2A4F73] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

