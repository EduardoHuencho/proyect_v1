import { useState, useRef, useEffect } from 'react';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { Sun, Sunset, Moon } from 'lucide-react';
import type { ActividadHorarioBD } from '../types/horario';

const DATOS_INICIALES: ActividadHorarioBD[] = [
  {
    id: '1',
    hour: '08:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-1',
    pictogram: {
      id: 'picto-1',
      pictogramName: 'Levantarse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/200x200?text=🛏️',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-1',
    },
  },
  {
    id: '2',
    hour: '09:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-2',
    pictogram: {
      id: 'picto-2',
      pictogramName: 'Bañarse',
      personal: false,
      description: 'Higiene',
      pictoImageUrl: 'https://placehold.co/200x200?text=🛁',
      category: { id: 'cat-2', categoryName: 'Higiene' },
      pictoImageKey: 'k-2',
    },
  },
  {
    id: '3',
    hour: '10:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-3',
    pictogram: {
      id: 'picto-3',
      pictogramName: 'Vestirse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/200x200?text=👕',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-3',
    },
  },
  {
    id: '4',
    hour: '14:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-4',
    pictogram: {
      id: 'picto-4',
      pictogramName: 'Almorzar',
      personal: false,
      description: 'Comida',
      pictoImageUrl: 'https://placehold.co/200x200?text=🍲',
      category: { id: 'cat-3', categoryName: 'Comida' },
      pictoImageKey: 'k-4',
    },
  },
  {
    id: '5',
    hour: '20:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-5',
    pictogram: {
      id: 'picto-5',
      pictogramName: 'Dormir',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/200x200?text=🌙',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-5',
    },
  },
];

const BLOQUES = [
  { clave: 'MAÑANA', etiqueta: 'Mañana', Icono: Sun, fondo: 'bg-[#E0F7FA]/40', tarjetaFondo: 'bg-[#FFFBEB]' },
  { clave: 'TARDE', etiqueta: 'Tarde', Icono: Sunset, fondo: 'bg-[#FFFBEB]/40', tarjetaFondo: 'bg-[#FFF7ED]' },
  { clave: 'NOCHE', etiqueta: 'Noche', Icono: Moon, fondo: 'bg-[#F0F4F8]/40', tarjetaFondo: 'bg-[#F1F5F9]' },
];

const horaABloque = (hora: string): 'MAÑANA' | 'TARDE' | 'NOCHE' => {
  const h = parseInt(hora.split(':')[0], 10);
  if (h < 12) return 'MAÑANA';
  if (h < 18) return 'TARDE';
  return 'NOCHE';
};

function HorarioNino() {
  const { ninoActivo } = useNino();
  const [bloqueActual, setBloqueActual] = useState<'MAÑANA' | 'TARDE' | 'NOCHE'>('MAÑANA');
  const [indiceActividad, setIndiceActividad] = useState(0);

  const vozAmigableRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const configurarVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      const vocesEs = voces.filter((v) => v.lang.startsWith('es'));
      vozAmigableRef.current =
        vocesEs.find((v) => v.name.includes('Google') || v.name.includes('Sabina') || v.name.includes('Paulina')) ||
        vocesEs[0];
    };
    configurarVoz();
    window.speechSynthesis.onvoiceschanged = configurarVoz;
  }, []);

  const reproducirVoz = (texto: string) => {
    if (!texto) return;
    const mensaje = new SpeechSynthesisUtterance(texto);
    if (vozAmigableRef.current) {
      mensaje.voice = vozAmigableRef.current;
      mensaje.lang = vozAmigableRef.current.lang;
    } else {
      mensaje.lang = 'es-ES';
    }
    mensaje.rate = 0.7;
    mensaje.pitch = 1.2;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(mensaje);
  };

  const actividadesBloque = DATOS_INICIALES.filter(
    (a) => horaABloque(a.hour) === bloqueActual
  );

  const anteriorActividad = () => {
    if (indiceActividad > 0) {
      setIndiceActividad((prev) => prev - 1);
    }
  };

  const siguienteActividad = () => {
    if (indiceActividad < actividadesBloque.length - 1) {
      setIndiceActividad((prev) => prev + 1);
    }
  };

  const bloqueInfo = BLOQUES.find((b) => b.clave === bloqueActual) || BLOQUES[0];
  const IconoBloque = bloqueInfo.Icono;

  const actividadPrev = actividadesBloque[indiceActividad - 1];
  const actividadActual = actividadesBloque[indiceActividad];
  const actividadNext = actividadesBloque[indiceActividad + 1];

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen">
        <Navbar rol="nino" />

        <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full select-none">
          <div className="flex items-center gap-3 bg-white/80 p-2 rounded-3xl shadow-md border border-gray-100">
            {BLOQUES.map((b) => {
              const CompIcono = b.Icono;
              const activo = bloqueActual === b.clave;
              return (
                <button
                  key={b.clave}
                  type="button"
                  onClick={() => {
                    setBloqueActual(b.clave as 'MAÑANA' | 'TARDE' | 'NOCHE');
                    setIndiceActividad(0);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                    activo
                      ? 'bg-[#1B3A5C] text-white shadow-md scale-105'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <CompIcono className="w-5 h-5" />
                  <span>{b.etiqueta}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full bg-white/90 rounded-[35px] p-6 sm:p-10 shadow-2xl border border-gray-200/80 my-auto flex flex-col items-center relative overflow-hidden">
            <div className="bg-[#E0F7FA] text-[#1B3A5C] px-8 py-2 rounded-full font-black text-lg mb-8 shadow-sm flex items-center gap-2">
              <IconoBloque className="w-5 h-5 text-amber-500" />
              <span>{bloqueInfo.etiqueta}</span>
            </div>

            {actividadesBloque.length === 0 ? (
              <div className="py-16 text-center text-gray-400 font-extrabold text-lg">
                No hay actividades programadas para la {bloqueInfo.etiqueta.toLowerCase()}.
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-3xl">
                <div className="hidden sm:flex flex-col items-center justify-center w-44 h-64 bg-gray-50/70 border-2 border-gray-200 rounded-3xl p-4 opacity-40 shrink-0 select-none">
                  {actividadPrev ? (
                    <>
                      <img
                        src={actividadPrev.pictogram?.pictoImageUrl}
                        alt={actividadPrev.pictogram?.pictogramName}
                        className="w-28 h-28 object-contain mb-3"
                      />
                      <span className="font-extrabold text-xs text-gray-600 text-center truncate w-full">
                        {actividadPrev.pictogram?.pictogramName}
                      </span>
                    </>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={anteriorActividad}
                  disabled={indiceActividad === 0}
                  className="w-12 h-12 rounded-full bg-white text-[#1B3A5C] border-2 border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#1B3A5C] hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                </button>

                {actividadActual && (
                  <div
                    className={`flex-1 max-w-xs h-80 sm:h-96 ${bloqueInfo.tarjetaFondo} border-3 border-amber-300 rounded-[30px] p-6 flex flex-col items-center justify-between shadow-xl transition-all relative shrink-0`}
                  >
                    <div className="w-full flex-1 flex flex-col items-center justify-center">
                      <img
                        src={actividadActual.pictogram?.pictoImageUrl}
                        alt={actividadActual.pictogram?.pictogramName}
                        className="max-h-44 sm:max-h-52 w-auto object-contain drop-shadow-md"
                      />
                      <span className="font-black text-xl sm:text-2xl text-[#1B3A5C] text-center mt-4 tracking-wide">
                        {actividadActual.pictogram?.pictogramName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        reproducirVoz(actividadActual.pictogram?.pictogramName || '')
                      }
                      className="w-12 h-12 rounded-2xl bg-[#FDD835] text-[#1B3A5C] border-2 border-[#C8A800] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title="Escuchar"
                    >
                      <FontAwesomeIcon icon={faVolumeHigh} className="text-lg" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={siguienteActividad}
                  disabled={indiceActividad === actividadesBloque.length - 1}
                  className="w-12 h-12 rounded-full bg-white text-[#1B3A5C] border-2 border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#1B3A5C] hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
                </button>

                <div className="hidden sm:flex flex-col items-center justify-center w-44 h-64 bg-gray-50/70 border-2 border-gray-200 rounded-3xl p-4 opacity-40 shrink-0 select-none">
                  {actividadNext ? (
                    <>
                      <img
                        src={actividadNext.pictogram?.pictoImageUrl}
                        alt={actividadNext.pictogram?.pictogramName}
                        className="w-28 h-28 object-contain mb-3"
                      />
                      <span className="font-extrabold text-xs text-gray-600 text-center truncate w-full">
                        {actividadNext.pictogram?.pictogramName}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default HorarioNino;