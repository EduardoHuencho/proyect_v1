import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { Sun, Sunset, Moon } from 'lucide-react';
import type { ActividadResumen, DiaSemana, RutinaAgrupadaDia } from '../types/horario';
import { getGroupedRoutine } from '../services/routineService';

const DIAS = [
  { numero: 1 as DiaSemana, abrev: 'Lun', nombre: 'Lunes' },
  { numero: 2 as DiaSemana, abrev: 'Mar', nombre: 'Martes' },
  { numero: 3 as DiaSemana, abrev: 'Mié', nombre: 'Miércoles' },
  { numero: 4 as DiaSemana, abrev: 'Jue', nombre: 'Jueves' },
  { numero: 5 as DiaSemana, abrev: 'Vie', nombre: 'Viernes' },
  { numero: 6 as DiaSemana, abrev: 'Sáb', nombre: 'Sábado' },
  { numero: 7 as DiaSemana, abrev: 'Dom', nombre: 'Domingo' },
];

const ORDEN_BLOQUES = ['MAÑANA', 'TARDE', 'NOCHE'] as const;
type TipoBloque = (typeof ORDEN_BLOQUES)[number];

const BLOQUES = [
  { clave: 'MAÑANA' as TipoBloque, etiqueta: 'Mañana', Icono: Sun, fondo: 'bg-[#E0F7FA]/40', tarjetaFondo: 'bg-[#FFFBEB]' },
  { clave: 'TARDE' as TipoBloque, etiqueta: 'Tarde', Icono: Sunset, fondo: 'bg-[#FFFBEB]/40', tarjetaFondo: 'bg-[#FFF7ED]' },
  { clave: 'NOCHE' as TipoBloque, etiqueta: 'Noche', Icono: Moon, fondo: 'bg-[#F0F4F8]/40', tarjetaFondo: 'bg-[#F1F5F9]' },
];

function getDiaHoy(): DiaSemana {
  const jsDay = new Date().getDay();
  return (jsDay === 0 ? 7 : jsDay) as DiaSemana;
}

function getBloquePorHora(): TipoBloque {
  const hora = new Date().getHours();
  if (hora < 12) return 'MAÑANA';
  if (hora < 19) return 'TARDE';
  return 'NOCHE';
}

function HorarioNino() {
  const navigate = useNavigate();
  const { ninoActivo } = useNino();
  const { token } = useAuth();

  const [rutinas, setRutinas] = useState<RutinaAgrupadaDia[]>([]);
  const [cargando, setCargando] = useState(true);

  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaSemana>(getDiaHoy);
  const [bloqueActual, setBloqueActual] = useState<TipoBloque>(getBloquePorHora);
  const [indiceActividad, setIndiceActividad] = useState(0);

  const vozAmigableRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!ninoActivo) {
      navigate('/accesotutor');
    }
  }, [ninoActivo, navigate]);

  useEffect(() => {
    const currentInfantId = ninoActivo?.id;
    if (!currentInfantId) return;

    let cancelado = false;
    async function cargarRutinas(id: string) {
      setCargando(true);
      try {
        const data = await getGroupedRoutine(id, token);
        if (!cancelado) {
          setRutinas(data);
        }
      } catch (err) {
        console.error('Error al cargar rutinas en horario niño:', err);
        if (!cancelado) {
          setRutinas([]);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarRutinas(currentInfantId);
    return () => {
      cancelado = true;
    };
  }, [ninoActivo?.id, token]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const configurarVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      const vocesEs = voces.filter((v) => v.lang.startsWith('es'));
      vozAmigableRef.current =
        vocesEs.find(
          (v) =>
            v.name.includes('Google') ||
            v.name.includes('Sabina') ||
            v.name.includes('Paulina')
        ) || vocesEs[0] || null;
    };

    configurarVoz();
    window.speechSynthesis.onvoiceschanged = configurarVoz;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const reproducirVoz = (texto: string) => {
    if (!texto || typeof window === 'undefined' || !window.speechSynthesis) return;
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

  const rutinaDelDia = rutinas.find((r) => r.dayOfWeek === diaSeleccionado);

  const obtenerActividadesDeBloque = (b: TipoBloque): ActividadResumen[] => {
    if (!rutinaDelDia) return [];
    let lista: ActividadResumen[] = [];
    if (b === 'MAÑANA') lista = rutinaDelDia.morning || [];
    else if (b === 'TARDE') lista = rutinaDelDia.afternoon || [];
    else if (b === 'NOCHE') lista = rutinaDelDia.night || [];
    return [...lista].sort((x, y) => x.position - y.position);
  };

  const actividadesBloque = obtenerActividadesDeBloque(bloqueActual);
  const indiceSeguro = Math.min(Math.max(0, indiceActividad), Math.max(0, actividadesBloque.length - 1));
  const actividadActual = actividadesBloque[indiceSeguro];

  const bloqueIdx = ORDEN_BLOQUES.indexOf(bloqueActual);

  let actividadPrev: ActividadResumen | undefined;
  if (indiceSeguro > 0) {
    actividadPrev = actividadesBloque[indiceSeguro - 1];
  } else if (bloqueIdx > 0) {
    const actsPrevBloque = obtenerActividadesDeBloque(ORDEN_BLOQUES[bloqueIdx - 1]);
    if (actsPrevBloque.length > 0) {
      actividadPrev = actsPrevBloque[actsPrevBloque.length - 1];
    }
  }

  let actividadNext: ActividadResumen | undefined;
  if (indiceSeguro < actividadesBloque.length - 1) {
    actividadNext = actividadesBloque[indiceSeguro + 1];
  } else if (bloqueIdx < ORDEN_BLOQUES.length - 1) {
    const actsNextBloque = obtenerActividadesDeBloque(ORDEN_BLOQUES[bloqueIdx + 1]);
    if (actsNextBloque.length > 0) {
      actividadNext = actsNextBloque[0];
    }
  }

  const puedeRetroceder = indiceSeguro > 0 || bloqueIdx > 0;
  const puedeAvanzar =
    (actividadesBloque.length > 0 && indiceSeguro < actividadesBloque.length - 1) ||
    bloqueIdx < ORDEN_BLOQUES.length - 1;

  const anteriorActividad = () => {
    if (indiceSeguro > 0) {
      setIndiceActividad(indiceSeguro - 1);
    } else if (bloqueIdx > 0) {
      const bloqueAnterior = ORDEN_BLOQUES[bloqueIdx - 1];
      const actsAnterior = obtenerActividadesDeBloque(bloqueAnterior);
      setBloqueActual(bloqueAnterior);
      setIndiceActividad(Math.max(0, actsAnterior.length - 1));
    }
  };

  const siguienteActividad = () => {
    if (indiceSeguro < actividadesBloque.length - 1) {
      setIndiceActividad(indiceSeguro + 1);
    } else if (bloqueIdx < ORDEN_BLOQUES.length - 1) {
      const bloqueSiguiente = ORDEN_BLOQUES[bloqueIdx + 1];
      setBloqueActual(bloqueSiguiente);
      setIndiceActividad(0);
    }
  };

  const diaHoy = getDiaHoy();
  const diaInfo = DIAS.find((d) => d.numero === diaSeleccionado) || DIAS[0];
  const bloqueInfo = BLOQUES.find((b) => b.clave === bloqueActual) || BLOQUES[0];
  const IconoBloque = bloqueInfo.Icono;

  if (!ninoActivo) return null;

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen">
        <Navbar rol="nino" />

        <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full select-none gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 p-1.5 sm:p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto max-w-full">
            {DIAS.map((d) => {
              const seleccionado = diaSeleccionado === d.numero;
              const esHoy = d.numero === diaHoy;
              return (
                <button
                  key={d.numero}
                  type="button"
                  onClick={() => {
                    setDiaSeleccionado(d.numero);
                    setIndiceActividad(0);
                  }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer relative shrink-0 ${
                    seleccionado
                      ? 'bg-[#1B3A5C] text-white shadow-sm scale-102'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{d.nombre}</span>
                  {esHoy && (
                    <span className="block text-[9px] font-black text-[#FDD835] uppercase leading-none mt-0.5">
                      Hoy
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 bg-white/80 p-2 rounded-3xl shadow-md border border-gray-100">
            {BLOQUES.map((b) => {
              const CompIcono = b.Icono;
              const activo = bloqueActual === b.clave;
              return (
                <button
                  key={b.clave}
                  type="button"
                  onClick={() => {
                    setBloqueActual(b.clave);
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

          <div className="w-full bg-white/90 rounded-[35px] p-6 sm:p-10 shadow-2xl border border-gray-200/80 my-auto flex flex-col items-center relative overflow-hidden min-h-105 justify-between">
            <div className="bg-[#E0F7FA] text-[#1B3A5C] px-6 sm:px-8 py-2 rounded-full font-black text-base sm:text-lg mb-4 shadow-sm flex items-center gap-2">
              <IconoBloque className="w-5 h-5 text-amber-500" />
              <span>{diaInfo.nombre} • {bloqueInfo.etiqueta}</span>
            </div>

            {cargando ? (
              <div className="my-auto py-16 text-center text-gray-400 font-extrabold text-lg animate-pulse">
                Cargando horario...
              </div>
            ) : actividadesBloque.length === 0 ? (
              <div className="my-auto py-12 flex flex-col items-center gap-4 text-center">
                <div className="text-gray-400 font-extrabold text-lg">
                  No hay actividades programadas para la {bloqueInfo.etiqueta.toLowerCase()}.
                </div>
                <div className="flex items-center gap-3">
                  {bloqueIdx > 0 && (
                    <button
                      type="button"
                      onClick={anteriorActividad}
                      className="px-4 py-2 rounded-2xl bg-white border-2 border-gray-200 text-[#1B3A5C] font-bold text-sm shadow-sm hover:bg-[#1B3A5C] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      <span>Ver {ORDEN_BLOQUES[bloqueIdx - 1].toLowerCase()}</span>
                    </button>
                  )}
                  {bloqueIdx < ORDEN_BLOQUES.length - 1 && (
                    <button
                      type="button"
                      onClick={siguienteActividad}
                      className="px-4 py-2 rounded-2xl bg-white border-2 border-gray-200 text-[#1B3A5C] font-bold text-sm shadow-sm hover:bg-[#1B3A5C] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Ver {ORDEN_BLOQUES[bloqueIdx + 1].toLowerCase()}</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-3xl my-auto">
                  <div className="hidden sm:flex flex-col items-center justify-center w-44 h-64 bg-gray-50/70 border-2 border-gray-200 rounded-3xl p-4 opacity-40 shrink-0 select-none">
                    {actividadPrev ? (
                      <>
                        {actividadPrev.pictogram?.pictoImageUrl ? (
                          <img
                            src={actividadPrev.pictogram.pictoImageUrl}
                            alt={actividadPrev.name || actividadPrev.pictogram?.pictogramName}
                            className="w-28 h-28 object-contain mb-3"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-2xl mb-3">
                            ⭐
                          </div>
                        )}
                        <span className="font-extrabold text-xs text-gray-600 text-center truncate w-full">
                          {actividadPrev.name || actividadPrev.pictogram?.pictogramName}
                        </span>
                      </>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={anteriorActividad}
                    disabled={!puedeRetroceder}
                    className="w-12 h-12 rounded-full bg-white text-[#1B3A5C] border-2 border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#1B3A5C] hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
                    aria-label="Actividad anterior"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                  </button>

                  {actividadActual && (
                    <div
                      className={`flex-1 max-w-xs h-80 sm:h-96 ${bloqueInfo.tarjetaFondo} border-3 border-amber-300 rounded-[30px] p-6 flex flex-col items-center justify-between shadow-xl transition-all relative shrink-0`}
                    >
                      <div className="w-full flex-1 flex flex-col items-center justify-center">
                        {actividadActual.pictogram?.pictoImageUrl ? (
                          <img
                            src={actividadActual.pictogram.pictoImageUrl}
                            alt={actividadActual.name || actividadActual.pictogram?.pictogramName}
                            className="max-h-44 sm:max-h-52 w-auto object-contain drop-shadow-md"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-white/80 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                            ⭐
                          </div>
                        )}
                        <span className="font-black text-xl sm:text-2xl text-[#1B3A5C] text-center mt-4 tracking-wide">
                          {actividadActual.name || actividadActual.pictogram?.pictogramName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          reproducirVoz(actividadActual.name || actividadActual.pictogram?.pictogramName || '')
                        }
                        className="w-12 h-12 rounded-2xl bg-[#FDD835] text-[#1B3A5C] border-2 border-[#C8A800] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title="Escuchar nombre"
                      >
                        <FontAwesomeIcon icon={faVolumeHigh} className="text-lg" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={siguienteActividad}
                    disabled={!puedeAvanzar}
                    className="w-12 h-12 rounded-full bg-white text-[#1B3A5C] border-2 border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#1B3A5C] hover:text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-90"
                    aria-label="Siguiente actividad"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
                  </button>

                  <div className="hidden sm:flex flex-col items-center justify-center w-44 h-64 bg-gray-50/70 border-2 border-gray-200 rounded-3xl p-4 opacity-40 shrink-0 select-none">
                    {actividadNext ? (
                      <>
                        {actividadNext.pictogram?.pictoImageUrl ? (
                          <img
                            src={actividadNext.pictogram.pictoImageUrl}
                            alt={actividadNext.name || actividadNext.pictogram?.pictogramName}
                            className="w-28 h-28 object-contain mb-3"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-2xl mb-3">
                            ⭐
                          </div>
                        )}
                        <span className="font-extrabold text-xs text-gray-600 text-center truncate w-full">
                          {actividadNext.name || actividadNext.pictogram?.pictogramName}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  {actividadesBloque.map((act, idx) => (
                    <span
                      key={act.id}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === indiceSeguro
                          ? 'w-6 bg-[#1B3A5C]'
                          : 'w-2.5 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default HorarioNino;