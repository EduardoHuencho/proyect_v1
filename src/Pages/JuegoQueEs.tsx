import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { getGameWhatItIsByCategory } from '../services/gameService';
import { registrarIntentoJuego, saveGameProgress, getGameIdQueEs } from '../services/progressService';
import { speakText } from '../services/speechService';
import type { RondaJuego, PictogramaJuego } from '../types/game';

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function aleatorizarRondas(rondasOriginales: RondaJuego[]): RondaJuego[] {
  if (!Array.isArray(rondasOriginales) || rondasOriginales.length === 0) return [];

  // Recopilar todos los pictogramas únicos encontrados en las rondas recibidas
  const mapaPictos = new Map<string, PictogramaJuego>();

  rondasOriginales.forEach((r) => {
    (r.pictograms || []).forEach((p) => {
      if (p && p.id) mapaPictos.set(p.id, p);
    });
  });

  const poolPictogramas = Array.from(mapaPictos.values());

  return rondasOriginales.map((ronda, index) => {
    const pictoCorrecto =
      ronda.pictograms?.find((p) => p.id === ronda.correctPictogramId) ||
      poolPictogramas.find((p) => p.id === ronda.correctPictogramId) ||
      ronda.pictograms?.[0];

    const distractoresDisponibles = poolPictogramas.filter((p) => p.id !== pictoCorrecto?.id);

    let opcionesRonda: PictogramaJuego[];

    if (distractoresDisponibles.length >= 3 && pictoCorrecto) {
      // Elegir 3 distractores aleatorios del pool para variar las opciones mostradas
      const distractoresSeleccionados = shuffleArray(distractoresDisponibles).slice(0, 3);
      // Mezclar la respuesta correcta con los distractores para que su posición en la cuadrícula sea aleatoria
      opcionesRonda = shuffleArray([pictoCorrecto, ...distractoresSeleccionados]);
    } else {
      // Si el pool es pequeño, mezclar las opciones existentes de la ronda
      opcionesRonda = shuffleArray(ronda.pictograms || []);
    }

    return {
      ...ronda,
      round: index + 1,
      prompt: pictoCorrecto?.pictogramName || ronda.prompt,
      correctPictogramId: pictoCorrecto?.id || ronda.correctPictogramId,
      pictograms: opcionesRonda,
    };
  });
}

const CLAVE_STORAGE = 'juego_que_es_estado';

interface EstadoJuegoGuardado {
  categoriaId: string;
  categoriaNombre: string;
  rondas: RondaJuego[];
  indiceRondaActual: number;
  aciertosAcumulados?: number;
}

function JuegoQueEs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutorAutenticado, ninoActivo } = useNino();
  const { token } = useAuth();

  const state = location.state as {
    categoriaId?: string;
    categoriaNombre?: string;
  } | null;

  // Recuperar progreso previo si la página fue recargada
  const [estadoGuardado] = useState<EstadoJuegoGuardado | null>(() => {
    try {
      const data = sessionStorage.getItem(CLAVE_STORAGE);
      return data ? (JSON.parse(data) as EstadoJuegoGuardado) : null;
    } catch {
      return null;
    }
  });

  const categoriaId = state?.categoriaId || estadoGuardado?.categoriaId;
  const categoriaNombreInicial = state?.categoriaNombre || estadoGuardado?.categoriaNombre;

  const [rondas, setRondas] = useState<RondaJuego[]>(() => estadoGuardado?.rondas || []);
  const [indiceRondaActual, setIndiceRondaActual] = useState<number>(() => estadoGuardado?.indiceRondaActual || 0);
  const [aciertos, setAciertos] = useState<number>(() => estadoGuardado?.aciertosAcumulados || 0);
  const [cargando, setCargando] = useState<boolean>(() => {
    if (estadoGuardado && estadoGuardado.rondas && estadoGuardado.rondas.length > 0) {
      return false;
    }
    return Boolean(categoriaId);
  });
  const [error, setError] = useState<string | null>(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<PictogramaJuego | null>(null);
  const [idOpcionIncorrecta, setIdOpcionIncorrecta] = useState<string | null>(null);
  const [estadoRespuesta, setEstadoRespuesta] = useState<'acierto' | 'error' | null>(null);
  const [bloquearOpciones, setBloquearOpciones] = useState(false);

  const reproducirVoz = (texto: string) => {
    speakText(texto, { rate: 0.8, pitch: 1.1 });
  };

  useEffect(() => {
    if (!categoriaId) return;

    // Si ya tenemos rondas cargadas (restauradas desde sessionStorage), evitamos volver a consultar la API
    if (rondas.length > 0) return;

    let montado = true;

    const cargarJuego = async () => {
      try {
        const dataRondas = await getGameWhatItIsByCategory(categoriaId, token);
        const rondasAleatorias = aleatorizarRondas(dataRondas);

        if (montado) {
          if (rondasAleatorias.length === 0) {
            setError('No hay preguntas disponibles para esta categoría.');
          } else {
            setRondas(rondasAleatorias);
            setIndiceRondaActual(0);
            setRespuestaSeleccionada(null);
            setError(null);

            try {
              sessionStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify({
                  categoriaId,
                  categoriaNombre: categoriaNombreInicial || '',
                  rondas: rondasAleatorias,
                  indiceRondaActual: 0,
                  aciertosAcumulados: 0,
                })
              );
            } catch (e) {
              console.error('Error al guardar progreso en sessionStorage:', e);
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar juego "¿Qué es?":', err);
        if (montado) {
          setError('No se pudo cargar el juego para esta categoría.');
        }
      } finally {
        if (montado) {
          setCargando(false);
        }
      }
    };

    void cargarJuego();

    return () => {
      montado = false;
    };
  }, [categoriaId, token, rondas.length, categoriaNombreInicial]);

  const rondaActual: RondaJuego | null = rondas[indiceRondaActual] || null;
  const totalPreguntas = rondas.length;
  const preguntaActual = indiceRondaActual + 1;
  const categoria =
    categoriaNombreInicial ||
    rondaActual?.pictograms?.[0]?.category?.categoryName ||
    'CATEGORÍA';

  const avanzarSiguienteRonda = (siguienteIndice: number, nuevosAciertos: number) => {
    setIndiceRondaActual(siguienteIndice);
    setAciertos(nuevosAciertos);
    setRespuestaSeleccionada(null);
    setEstadoRespuesta(null);
    setIdOpcionIncorrecta(null);
    setBloquearOpciones(false);

    try {
      const data = sessionStorage.getItem(CLAVE_STORAGE);
      if (data) {
        const parsed = JSON.parse(data) as EstadoJuegoGuardado;
        parsed.indiceRondaActual = siguienteIndice;
        parsed.aciertosAcumulados = nuevosAciertos;
        sessionStorage.setItem(CLAVE_STORAGE, JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Error al actualizar progreso en sessionStorage:', e);
    }
  };

  const handleSeleccionarOpcion = (opcion: PictogramaJuego) => {
    if (bloquearOpciones || !rondaActual) return;
    setRespuestaSeleccionada(opcion);

    const esCorrecta = opcion.id === rondaActual.correctPictogramId;
    const aciertosTotales = aciertos + (esCorrecta ? 1 : 0);

    // Registrar intento en el frontend para compatibilidad
    if (ninoActivo?.id) {
      const cat = rondaActual.pictograms?.[0]?.category;
      const catId = categoriaId || cat?.id || 'general';
      const catNombre = categoria || cat?.categoryName || 'General';
      registrarIntentoJuego(ninoActivo.id, catId, catNombre, esCorrecta, cat?.color);
    }

    const esUltima = indiceRondaActual + 1 >= rondas.length;

    const guardarFinPartida = () => {
      if (ninoActivo?.id && categoriaId) {
        const catId = categoriaId;
        void getGameIdQueEs(token).then((gameId) => {
          void saveGameProgress(
            {
              infantId: ninoActivo.id,
              game: gameId,
              categoryPlayedId: catId,
              correctAnswers: aciertosTotales,
              totalAnswers: rondas.length,
            },
            token
          );
        });
      }
    };

    if (esCorrecta) {
      setBloquearOpciones(true);
      setEstadoRespuesta('acierto');
      setIdOpcionIncorrecta(null);
      reproducirVoz(opcion.pictogramName);

      if (esUltima) {
        guardarFinPartida();
        try {
          sessionStorage.removeItem(CLAVE_STORAGE);
        } catch (e) {
          console.error('Error al limpiar progreso en sessionStorage:', e);
        }

        Swal.fire({
          title: 'Buen Trabajo',
          text: 'Juego Finalizado',
          icon: 'success',
        }).then(() => {
          navigate('/menujuegos');
        });
      } else {
        Swal.fire({
          position: 'top-start',
          icon: 'success',
          title: 'Has seleccionado la opción correcta',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          avanzarSiguienteRonda(indiceRondaActual + 1, aciertosTotales);
        });
      }
    } else {
      setBloquearOpciones(true);
      setEstadoRespuesta('error');
      setIdOpcionIncorrecta(opcion.id);

      const pictoCorrecto = rondaActual.pictograms.find(
        (p) => p.id === rondaActual.correctPictogramId
      );
      const nombrePreguntado = pictoCorrecto?.pictogramName || rondaActual.prompt;
      Swal.fire({
        position: 'top-start',
        icon: 'warning',
        title: `Seleccionaste: ${opcion.pictogramName}\nSe buscaba: ${nombrePreguntado}`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        if (esUltima) {
          guardarFinPartida();
          try {
            sessionStorage.removeItem(CLAVE_STORAGE);
          } catch (e) {
            console.error('Error al limpiar progreso en sessionStorage:', e);
          }

          Swal.fire({
            title: 'Buen Trabajo',
            text: 'Juego Finalizado',
            icon: 'success',
          }).then(() => {
            navigate('/menujuegos');
          });
        } else {
          avanzarSiguienteRonda(indiceRondaActual + 1, aciertosTotales);
        }
      });
    }
  };

  const reproducirAudio = () => {
    if (!rondaActual) return;
    const pictoCorrecto = rondaActual.pictograms.find((p) => p.id === rondaActual.correctPictogramId);
    const textoParaReproducir = rondaActual.prompt || pictoCorrecto?.pictogramName || '¿Qué es?';
    reproducirVoz(textoParaReproducir);
  };

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen select-none">
        <Navbar
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={false}
          rutaVolver="/menujuegos"
          labelVolver="Volver"
          pinSoloDesbloquea={true}
        />

        {cargando ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-[#FFD57E] border-t-[#1B3A5C] rounded-full animate-spin mb-4" />
            <p className="text-xl font-black text-[#1B3A5C]">Cargando juego...</p>
          </div>
        ) : !categoriaId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white border-[3px] border-[#1B3A5C] rounded-[28px] p-8 max-w-md shadow-[0_6px_0_#1B3A5C]">
              <h2 className="text-2xl font-black text-[#1B3A5C] mb-3">No seleccionaste una categoría</h2>
              <p className="text-gray-600 mb-6 font-medium">
                Por favor, elige una categoría desde el menú para comenzar a jugar.
              </p>
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem(CLAVE_STORAGE);
                  } catch (e) {
                    console.error('Error al limpiar sesión:', e);
                  }
                  navigate('/menujuegos');
                }}
                className="bg-[#FFD57E] border-2 border-[#1B3A5C] text-[#1B3A5C] font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_#1B3A5C] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Elegir categoría
              </button>
            </div>
          </div>
        ) : error || rondas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white border-[3px] border-[#1B3A5C] rounded-[28px] p-8 max-w-md shadow-[0_6px_0_#1B3A5C]">
              <h2 className="text-2xl font-black text-[#1B3A5C] mb-3">
                {error || 'No hay preguntas disponibles'}
              </h2>
              <p className="text-gray-600 mb-6 font-medium">
                {error
                  ? 'Ocurrió un problema al obtener las preguntas del servidor.'
                  : 'Aún no se han configurado preguntas para esta categoría.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem(CLAVE_STORAGE);
                  } catch (e) {
                    console.error('Error al limpiar sesión:', e);
                  }
                  navigate('/menujuegos');
                }}
                className="bg-[#FFD57E] border-2 border-[#1B3A5C] text-[#1B3A5C] font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_#1B3A5C] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Volver al menú de juegos
              </button>
            </div>
          </div>
        ) : rondaActual ? (
          <div className="flex-1 max-w-350 w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
            
            <div className="w-full max-w-md mb-6">
              <span className="text-xs sm:text-sm font-extrabold text-[#1B3A5C] tracking-wide">
                Pregunta {preguntaActual} de {totalPreguntas}
              </span>
              <div
                className="grid gap-2 mt-2"
                style={{ gridTemplateColumns: `repeat(${totalPreguntas}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: totalPreguntas }, (_, i) => i + 1).map((num) => {
                  let colorBarra = 'bg-white/60 border border-gray-300';
                  if (num < preguntaActual) colorBarra = 'bg-[#1B3A5C]';
                  else if (num === preguntaActual) colorBarra = 'bg-[#FDD835] border-2 border-[#C8A800]';

                  return (
                    <div
                      key={num}
                      className={`h-3 rounded-full transition-all shadow-xs ${colorBarra}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-6">
                
                <div className="w-full max-w-sm bg-[#FFD57E] border-[3px] border-[#1B3A5C] rounded-[28px] py-5 px-6 shadow-[0_6px_0_#1B3A5C] text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1B3A5C] tracking-wide">
                    {rondaActual.prompt || '¿QUÉ ES?'}
                  </h2>
                </div>

                <div className="w-full max-w-sm text-center lg:text-left">
                  <span className="text-xs sm:text-sm font-black text-[#1B3A5C] tracking-wider uppercase">
                    CATEGORÍA: <span className="text-blue-700">{categoria}</span>
                  </span>
                </div>

                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={reproducirAudio}
                    aria-label="Escuchar audio"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FFD57E] border-[3px] border-[#1B3A5C] flex items-center justify-center shadow-[0_5px_0_#1B3A5C] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFC107] rounded-full border-2 border-[#1B3A5C] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="flex gap-2 mb-1">
                          <div className="w-2 h-2 bg-[#1B3A5C] rounded-full" />
                          <div className="w-2 h-2 bg-[#1B3A5C] rounded-full" />
                        </div>
                        <div className="w-8 h-4 bg-[#D32F2F] rounded-b-full border border-[#1B3A5C] flex items-center justify-center">
                          <div className="w-4 h-2 bg-rose-300 rounded-t-full" />
                        </div>
                      </div>
                      <FontAwesomeIcon
                        icon={faVolumeHigh}
                        className="absolute -bottom-1 -right-2 text-[#1B3A5C] text-lg bg-white p-1.5 rounded-full border border-[#1B3A5C]"
                      />
                    </div>
                  </button>

                  <div className="w-full bg-[#FFD57E] border-[3px] border-[#1B3A5C] rounded-[22px] py-3.5 px-6 shadow-[0_4px_0_#1B3A5C] text-center min-h-14.5 flex items-center justify-center">
                    <span className="text-base sm:text-lg font-black text-[#1B3A5C] uppercase tracking-wider">
                      {respuestaSeleccionada?.pictogramName || 'SELECCIONA UNA OPCIÓN'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Opciones de Pictogramas */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto w-full">
                {rondaActual.pictograms.map((opcion) => {
                  const esEstaCorrecta = opcion.id === rondaActual.correctPictogramId;
                  const esEstaIncorrecta = idOpcionIncorrecta === opcion.id;
                  const estaSeleccionado = respuestaSeleccionada?.id === opcion.id;

                  let fondoColor = '#FFFFFF';
                  let estiloBorde = 'border-[#1B3A5C]/40 hover:border-[#1B3A5C]';

                  if (estadoRespuesta === 'acierto' && estaSeleccionado) {
                    fondoColor = '#AFE9B7';
                    estiloBorde = 'border-[#2E7D32] ring-4 ring-[#AFE9B7]/50 shadow-[0_6px_0_#2E7D32]';
                  } else if (estadoRespuesta === 'error') {
                    if (esEstaIncorrecta) {
                      fondoColor = '#EAD7EE';
                      estiloBorde = 'border-[#8E24AA] ring-4 ring-[#EAD7EE]/60 shadow-[0_6px_0_#8E24AA]';
                    } else if (esEstaCorrecta) {
                      fondoColor = '#AFE9B7';
                      estiloBorde = 'border-[#2E7D32] ring-4 ring-[#AFE9B7]/60 shadow-[0_6px_0_#2E7D32] animate-pulse';
                    }
                  } else if (estaSeleccionado) {
                    estiloBorde = 'border-[#1B3A5C] ring-4 ring-[#1B3A5C]/20 shadow-[0_6px_0_#1B3A5C]';
                  }

                  return (
                    <button
                      key={opcion.id}
                      type="button"
                      disabled={bloquearOpciones}
                      onClick={() => handleSeleccionarOpcion(opcion)}
                      style={{ backgroundColor: fondoColor }}
                      className={`border-[3px] rounded-[30px] p-4 sm:p-5 flex flex-col items-center justify-between gap-4 transition-all cursor-pointer shadow-md hover:scale-102 active:scale-95 disabled:cursor-not-allowed ${estiloBorde}`}
                    >
                      <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2">
                        <img
                          src={opcion.pictoImageUrl}
                          alt={opcion.pictogramName}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <div
                        className="w-full py-2 border-2 border-[#1B3A5C] rounded-2xl text-center shadow-xs transition-colors"
                        style={{
                          backgroundColor:
                            (estadoRespuesta === 'acierto' && estaSeleccionado) ||
                            (estadoRespuesta === 'error' && esEstaCorrecta)
                              ? '#D8F7DE'
                              : estadoRespuesta === 'error' && esEstaIncorrecta
                              ? '#F5E8F8'
                              : '#FFFFFF',
                        }}
                      >
                        <span className="text-xs sm:text-sm font-black text-[#1B3A5C] tracking-wide uppercase">
                          {opcion.pictogramName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        ) : null}
      </div>
    </Fondo>
  );
}

export default JuegoQueEs;
