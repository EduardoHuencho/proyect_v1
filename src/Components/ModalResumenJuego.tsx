import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateRight,
  faArrowLeft,
  faCheck,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

export interface ItemResumenJuego {
  id: string;
  nombre: string;
  imagenUrl: string;
  esCorrecta: boolean;
}

interface ModalResumenJuegoProps {
  isOpen: boolean;
  resultados: ItemResumenJuego[];
  onReiniciar: () => void;
  onVolverMenu: () => void;
}

export function ModalResumenJuego({
  isOpen,
  resultados,
  onReiniciar,
  onVolverMenu,
}: ModalResumenJuegoProps) {
  if (!isOpen) return null;

  const totalCorrectas = resultados.filter((r) => r.esCorrecta).length;
  const totalAPracticar = resultados.length - totalCorrectas;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn select-none">
      <div className="bg-white border-[3px] border-[#1B3A5C] rounded-4xl p-5 sm:p-7 pt-6 sm:pt-7 max-w-xl sm:max-w-2xl w-full shadow-[0_8px_0_#1B3A5C] flex flex-col items-center text-center relative">
        {/* Título más cerca de la parte superior */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#1B3A5C] mb-4 tracking-wide">
          JUEGO COMPLETADO
        </h2>

        <div className="w-full flex items-center justify-center gap-3 sm:gap-4 mb-5">
          <div className="flex-1 max-w-60 py-2.5 px-3 rounded-2xl bg-[#D8F7DE] border-2 border-[#2E7D32] text-[#2E7D32] flex items-center justify-center gap-2 shadow-xs">
            <FontAwesomeIcon icon={faCheck} className="text-base sm:text-lg" />
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {totalCorrectas} CORRECTAS
            </span>
          </div>

          <div className="flex-1 max-w-60 py-2.5 px-3 rounded-2xl bg-[#EAD7EE] border-2 border-[#8E24AA] text-[#8E24AA] flex items-center justify-center gap-2 shadow-xs">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base sm:text-lg" />
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {totalAPracticar} A PRACTICAR
            </span>
          </div>
        </div>

        <div className="w-full bg-[#F5F9FA] border-2 border-[#1B3A5C]/20 rounded-2xl p-3 sm:p-4 mb-6 max-h-64 sm:max-h-72 overflow-y-auto flex flex-col gap-2.5">
          {resultados.length === 0 ? (
            <p className="text-xs text-gray-500 font-semibold py-4">
              No hay respuestas registradas.
            </p>
          ) : (
            resultados.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-white border-2 border-[#1B3A5C]/15 rounded-xl shadow-xs gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-lg border-2 border-[#1B3A5C]/20 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    {item.imagenUrl ? (
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">?</span>
                    )}
                  </div>
                  <span className="font-black text-[#1B3A5C] text-xs sm:text-sm uppercase truncate text-left">
                    {item.nombre}
                  </span>
                </div>

                <div className="shrink-0">
                  {item.esCorrecta ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D8F7DE] border border-[#2E7D32] text-[#2E7D32] font-black text-xs tracking-wider">
                      <FontAwesomeIcon icon={faCheck} className="text-[#2E7D32] text-xs" />
                      <span>CORRECTO</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAD7EE] border border-[#8E24AA] text-[#8E24AA] font-black text-xs tracking-wider">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#8E24AA] text-xs" />
                      <span>SEGUIR PRACTICANDO</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onVolverMenu}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#FFD57E] border-2 border-[#1B3A5C] text-[#1B3A5C] font-black text-sm shadow-[0_4px_0_#1B3A5C] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>TERMINAR</span>
          </button>

          <button
            type="button"
            onClick={onReiniciar}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#EAD7EE] border-2 border-[#8E24AA] text-[#1B3A5C] font-black text-sm shadow-[0_4px_0_#8E24AA] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateRight} />
            <span>VOLVER A JUGAR</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalResumenJuego;
