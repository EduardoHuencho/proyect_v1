import { useState, useEffect, useRef, useCallback } from 'react';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { PlantillaHorario } from '../Components/PlantillaHorario';
import { FormularioActividad } from '../Components/FormularioActividad';
import { TarjetaActividadHorario } from '../Components/TarjetaActividadHorario';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPrint,
  faArrowUp,
  faArrowDown,
  faPen,
  faTrashCan,
  faXmark,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Sun, Sunset, Moon } from 'lucide-react';
import type { ActividadRutinaVista, DiaSemana, JornadaBackend } from '../types/horario';
import {
  getGroupedRoutine,
  createRoutine,
  createRoutineActivity,
  updateRoutineActivity,
  deleteRoutineActivity,
} from '../services/routineService';

const DIAS = [
  { clave: 'LUNES', numero: 1 as DiaSemana, abrev: 'Lun' },
  { clave: 'MARTES', numero: 2 as DiaSemana, abrev: 'Mar' },
  { clave: 'MIÉRCOLES', numero: 3 as DiaSemana, abrev: 'Mié' },
  { clave: 'JUEVES', numero: 4 as DiaSemana, abrev: 'Jue', esHoy: true },
  { clave: 'VIERNES', numero: 5 as DiaSemana, abrev: 'Vie' },
  { clave: 'SÁBADO', numero: 6 as DiaSemana, abrev: 'Sáb' },
  { clave: 'DOMINGO', numero: 7 as DiaSemana, abrev: 'Dom' },
];

const DIA_CLAVE_A_NUMERO: Record<string, DiaSemana> = {
  LUNES: 1,
  MARTES: 2,
  'MIÉRCOLES': 3,
  MIERCOLES: 3,
  JUEVES: 4,
  VIERNES: 5,
  'SÁBADO': 6,
  SABADO: 6,
  DOMINGO: 7,
};

const JORNADA_A_BACKEND: Record<string, JornadaBackend> = {
  MAÑANA: 'MORNING',
  TARDE: 'AFTERNOON',
  NOCHE: 'NIGHT',
};

const BLOQUES = [
  {
    clave: 'MAÑANA',
    stage: 'MORNING' as JornadaBackend,
    etiqueta: 'Mañana',
    IconoLucide: Sun,
    colorIcono: 'text-yellow-500',
    colorFondo: 'bg-[#F0F8F8]/60',
  },
  {
    clave: 'TARDE',
    stage: 'AFTERNOON' as JornadaBackend,
    etiqueta: 'Tarde',
    IconoLucide: Sunset,
    colorIcono: 'text-amber-500',
    colorFondo: 'bg-[#FFFBEB]/60',
  },
  {
    clave: 'NOCHE',
    stage: 'NIGHT' as JornadaBackend,
    etiqueta: 'Noche',
    IconoLucide: Moon,
    colorIcono: 'text-indigo-500',
    colorFondo: 'bg-[#F0F4F8]/60',
  },
];

function HorarioTutor() {
  const { ninoActivo, setNinoActivo, ninos, cargarNinos } = useNino();
  const { userId, token } = useAuth();

  useEffect(() => {
    if (userId) {
      cargarNinos(userId);
    }
  }, [userId, cargarNinos]);

  const [actividades, setActividades] = useState<ActividadRutinaVista[]>([]);
  const [infanteHorarioId, setInfanteHorarioId] = useState<string | null>(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadRutinaVista | null>(null);

  const rutinasPorDia = useRef<Map<DiaSemana, string>>(new Map());

  const recargarHorario = useCallback(async (infantId: string, isCancelled?: () => boolean) => {
    try {
      const rutinasAgrupadas = await getGroupedRoutine(infantId, token);
      if (isCancelled && isCancelled()) return;

      const nuevoMapaRutinas = new Map<DiaSemana, string>();
      const listaActividades: ActividadRutinaVista[] = [];

      for (const rutina of rutinasAgrupadas) {
        if (!rutina || !rutina.dayOfWeek) continue;

        const dayOfWeek = rutina.dayOfWeek;
        const routineId = rutina.id;
        nuevoMapaRutinas.set(dayOfWeek, routineId);

        if (Array.isArray(rutina.morning)) {
          for (const act of rutina.morning) {
            listaActividades.push({
              id: act.id,
              routineId,
              infantId,
              dayOfWeek,
              stage: 'MORNING',
              position: act.position,
              name: act.name,
              pictogram: act.pictogram,
            });
          }
        }

        if (Array.isArray(rutina.afternoon)) {
          for (const act of rutina.afternoon) {
            listaActividades.push({
              id: act.id,
              routineId,
              infantId,
              dayOfWeek,
              stage: 'AFTERNOON',
              position: act.position,
              name: act.name,
              pictogram: act.pictogram,
            });
          }
        }

        if (Array.isArray(rutina.night)) {
          for (const act of rutina.night) {
            listaActividades.push({
              id: act.id,
              routineId,
              infantId,
              dayOfWeek,
              stage: 'NIGHT',
              position: act.position,
              name: act.name,
              pictogram: act.pictogram,
            });
          }
        }
      }

      rutinasPorDia.current = nuevoMapaRutinas;
      setActividades(listaActividades);
      setInfanteHorarioId(infantId);
    } catch (error) {
      console.error('Error al cargar el horario del infante:', error);
      if (isCancelled && isCancelled()) return;

      rutinasPorDia.current.clear();
      setActividades([]);
      setInfanteHorarioId(infantId);
    }
  }, [token]);

  useEffect(() => {
    let cancelado = false;
    const isCancelled = () => cancelado;

    if (!ninoActivo?.id) {
      rutinasPorDia.current.clear();
      Promise.resolve().then(() => {
        if (!cancelado) {
          setActividades([]);
          setInfanteHorarioId(null);
        }
      });
      return;
    }

    void (async () => {
      await recargarHorario(ninoActivo.id, isCancelled);
    })();

    return () => {
      cancelado = true;
    };
  }, [ninoActivo?.id, recargarHorario]);

  const actividadesActuales = infanteHorarioId === ninoActivo?.id ? actividades : [];

  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [formDiaInicial, setFormDiaInicial] = useState<string | undefined>(undefined);
  const [formJornadaInicial, setFormJornadaInicial] = useState<'MAÑANA' | 'TARDE' | 'NOCHE' | undefined>(undefined);
  const [actividadAEditar, setActividadAEditar] = useState<ActividadRutinaVista | null>(null);

  const handleAbrirFormulario = (diaClave?: string, jornadaClave?: 'MAÑANA' | 'TARDE' | 'NOCHE') => {
    setActividadAEditar(null);
    setFormDiaInicial(diaClave);
    setFormJornadaInicial(jornadaClave);
    setModalFormularioAbierto(true);
  };

  const handleGuardarActividad = async (datos: {
    pictogramId?: string;
    pictograma?: unknown;
    titulo: string;
    jornada: 'MAÑANA' | 'TARDE' | 'NOCHE';
    dias: string[];
  }) => {
    if (!ninoActivo?.id) {
      alert('Por favor selecciona un infante antes de continuar.');
      return;
    }

    if (!datos.pictogramId) {
      alert('Debes seleccionar un pictograma para la actividad.');
      return;
    }

    const stageBackend = JORNADA_A_BACKEND[datos.jornada] || 'MORNING';

    if (actividadAEditar) {
      const routineId =
        actividadAEditar.routineId ||
        rutinasPorDia.current.get(actividadAEditar.dayOfWeek);

      if (!routineId) {
        alert('No se encontró la rutina asociada a esta actividad.');
        return;
      }

      await updateRoutineActivity(
        routineId,
        actividadAEditar.id,
        {
          name: datos.titulo,
          pictogramId: datos.pictogramId,
          stage: stageBackend,
        },
        token
      );

      setActividadAEditar(null);
      await recargarHorario(ninoActivo.id);
      return;
    }

    const diasNumeros = datos.dias
      .map((d) => DIA_CLAVE_A_NUMERO[d])
      .filter((n): n is DiaSemana => typeof n === 'number');

    if (diasNumeros.length === 0) return;

    for (const diaNum of diasNumeros) {
      let routineId = rutinasPorDia.current.get(diaNum);

      if (!routineId) {
        try {
          const res = await createRoutine(
            { infantId: ninoActivo.id, dayOfWeek: diaNum },
            token
          );
          routineId = res.id;
          rutinasPorDia.current.set(diaNum, routineId);
        } catch {
          // Si la rutina ya existe en el backend, se consultan las rutinas para obtener su ID
          const rutinasExistentes = await getGroupedRoutine(ninoActivo.id, token);
          const rutinaEncontrada = rutinasExistentes.find((r) => r.dayOfWeek === diaNum);
          if (rutinaEncontrada?.id) {
            routineId = rutinaEncontrada.id;
            rutinasPorDia.current.set(diaNum, routineId);
          } else {
            throw new Error(`No se pudo obtener ni crear la rutina para el día ${diaNum}`);
          }
        }
      }

      const actividadesEnMismoBloque = actividades.filter(
        (a) => a.dayOfWeek === diaNum && a.stage === stageBackend
      );
      const siguientePosicion =
        actividadesEnMismoBloque.length > 0
          ? Math.max(...actividadesEnMismoBloque.map((a) => a.position)) + 1
          : 0;

      await createRoutineActivity(
        routineId,
        {
          name: datos.titulo,
          pictogramId: datos.pictogramId,
          stage: stageBackend,
          position: siguientePosicion,
        },
        token
      );
    }

    await recargarHorario(ninoActivo.id);
  };

  const handleMoverActividad = async (direccion: 'SUBIR' | 'BAJAR') => {
    if (!actividadSeleccionada || !ninoActivo?.id) return;

    const routineId =
      actividadSeleccionada.routineId ||
      rutinasPorDia.current.get(actividadSeleccionada.dayOfWeek);

    if (!routineId) {
      alert('No se encontró la rutina asociada a esta actividad.');
      return;
    }

    const actividadesCelda = actividades
      .filter(
        (a) =>
          a.dayOfWeek === actividadSeleccionada.dayOfWeek &&
          a.stage === actividadSeleccionada.stage
      )
      .sort((a, b) => a.position - b.position);

    const index = actividadesCelda.findIndex(
      (a) => a.id === actividadSeleccionada.id
    );
    if (index === -1) return;

    const targetIndex = direccion === 'SUBIR' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= actividadesCelda.length) {
      setActividadSeleccionada(null);
      return;
    }

    const otro = actividadesCelda[targetIndex];
    const posActual = actividadSeleccionada.position;
    let posOtro = otro.position;

    if (posActual === posOtro) {
      posOtro = direccion === 'SUBIR' ? Math.max(0, posActual - 1) : posActual + 1;
    }

    try {
      await Promise.all([
        updateRoutineActivity(
          routineId,
          actividadSeleccionada.id,
          { position: posOtro },
          token
        ),
        updateRoutineActivity(
          routineId,
          otro.id,
          { position: posActual },
          token
        ),
      ]);
      setActividadSeleccionada(null);
      await recargarHorario(ninoActivo.id);
    } catch (err) {
      console.error('Error al mover actividad:', err);
      alert('Ocurrió un error al cambiar la posición de la actividad.');
    }
  };

  const handleEditarActividad = () => {
    if (!actividadSeleccionada) return;
    setActividadAEditar(actividadSeleccionada);
    setActividadSeleccionada(null);
    setModalFormularioAbierto(true);
  };

  const handleEliminarActividad = async () => {
    if (!actividadSeleccionada || !ninoActivo?.id) return;

    const routineId =
      actividadSeleccionada.routineId ||
      rutinasPorDia.current.get(actividadSeleccionada.dayOfWeek);

    if (!routineId) {
      alert('No se encontró la rutina asociada a esta actividad.');
      return;
    }

    const confirmacion = window.confirm(
      `¿Deseas eliminar la actividad "${actividadSeleccionada.name}"?`
    );
    if (!confirmacion) return;

    try {
      await deleteRoutineActivity(routineId, actividadSeleccionada.id, token);
      setActividadSeleccionada(null);
      await recargarHorario(ninoActivo.id);
    } catch (err) {
      console.error('Error al eliminar actividad:', err);
      alert('Ocurrió un error al eliminar la actividad.');
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const nombreInfanteFormat = ninoActivo
    ? `${ninoActivo.firstName} ${ninoActivo.lastName || ''}`.trim()
    : 'General';

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen">
        <div className="print:hidden">
          <Navbar
            rol="tutor"
            rutaVolver="/dashboardtutor"
            labelVolver="Menú"
            pinSoloDesbloquea={true}
          />
        </div>

        <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6 select-none print:hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3A5C]">
                Calendario de Rutina Semanal
              </h1>
              <p className="text-sm font-medium text-[#78909C] mt-1">
                Gestiona y personaliza las actividades diarias asignadas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#E0F7FA] border border-[#B2EBF2] px-3 py-1.5 rounded-2xl w-full sm:w-auto">
                <FontAwesomeIcon icon={faUser} className="text-[#1B3A5C] text-sm" />
                <select
                  value={ninoActivo?.id || ''}
                  onChange={(e) => {
                    const seleccionado = ninos.find((n) => n.id === e.target.value);
                    if (seleccionado) setNinoActivo(seleccionado);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-extrabold text-[#1B3A5C] outline-none cursor-pointer w-full sm:w-auto"
                >
                  {ninos.length === 0 ? (
                    <option value="">Sin perfiles de infantes</option>
                  ) : (
                    ninos.map((nino) => (
                      <option key={nino.id} value={nino.id}>
                        {nino.firstName} {nino.lastName || ''}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleAbrirFormulario()}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#1B3A5C] text-white font-bold text-sm hover:bg-[#2A4F73] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Nueva Actividad</span>
              </button>

              <button
                type="button"
                onClick={handleImprimir}
                className="px-4 py-2.5 rounded-full border-2 border-[#1B3A5C] text-[#1B3A5C] font-bold text-sm hover:bg-[#1B3A5C] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-3xl shadow-md border border-[#1B3A5C]/20 bg-white">
            <div className="min-w-275">
              <div className="grid grid-cols-8 bg-[#2C4858] text-white text-center font-bold text-base py-4 items-center">
                <div className="text-xs uppercase tracking-wider text-gray-300 font-extrabold">
                  BLOQUE
                </div>
                {DIAS.map((d) => (
                  <div key={d.clave} className="flex justify-center items-center">
                    {d.esHoy ? (
                      <span className="bg-[#FDD835] text-[#1B3A5C] px-5 py-1 rounded-full font-black text-sm shadow-sm">
                        {d.abrev}
                      </span>
                    ) : (
                      <span>{d.abrev}</span>
                    )}
                  </div>
                ))}
              </div>

              {BLOQUES.map((bloque) => {
                const IconoComp = bloque.IconoLucide;
                return (
                  <div
                    key={bloque.clave}
                    className={`grid grid-cols-8 border-b border-gray-200/60 min-h-55 ${bloque.colorFondo}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 p-4 border-r border-gray-200/80 font-extrabold text-[#1B3A5C]">
                      <IconoComp className={`w-7 h-7 ${bloque.colorIcono}`} />
                      <span className="text-base">{bloque.etiqueta}</span>
                    </div>

                    {DIAS.map((dia) => {
                      const actividadesCelda = actividadesActuales
                        .filter((a) => a.dayOfWeek === dia.numero && a.stage === bloque.stage)
                        .sort((a, b) => a.position - b.position);

                      return (
                        <div
                          key={dia.clave}
                          className="p-3 border-r border-gray-200/50 last:border-none flex flex-col gap-2.5 items-center justify-start min-h-50"
                        >
                          {actividadesCelda.map((act) => (
                            <TarjetaActividadHorario
                              key={act.id}
                              actividad={act}
                              onOpcionesClick={(a) => setActividadSeleccionada(a)}
                            />
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAbrirFormulario(dia.clave, bloque.clave as 'MAÑANA' | 'TARDE' | 'NOCHE')}
                            className="w-full py-2 px-3 rounded-2xl border-2 border-dashed border-[#78909C]/40 hover:border-[#1B3A5C] text-[#78909C] hover:text-[#1B3A5C] font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-auto bg-white/50 hover:bg-white cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            <span>Añadir</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div id="zona-impresion" className="hidden print:block p-4">
          <PlantillaHorario
            nombreInfante={nombreInfanteFormat}
            actividades={actividadesActuales}
          />
        </div>
      </div>

      {modalFormularioAbierto && (
        <FormularioActividad
          isOpen={modalFormularioAbierto}
          onClose={() => {
            setModalFormularioAbierto(false);
            setActividadAEditar(null);
          }}
          onGuardar={handleGuardarActividad}
          token={token}
          diaInicial={formDiaInicial}
          jornadaInicial={formJornadaInicial}
          actividadInicial={actividadAEditar}
        />
      )}

      {actividadSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn print:hidden">
          <div className="tarjeta-auth max-w-xs w-full p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActividadSeleccionada(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-base" />
            </button>

            <div className="text-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-[#1B3A5C] text-lg">Configurar Actividad</h3>
              <p className="text-xs text-[#78909C] font-bold mt-1">
                {actividadSeleccionada.pictogram?.pictogramName}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleMoverActividad('SUBIR')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white font-bold text-xs transition-colors flex items-center justify-start gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowUp} />
                <span>Subir posición</span>
              </button>

              <button
                type="button"
                onClick={() => handleMoverActividad('BAJAR')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white font-bold text-xs transition-colors flex items-center justify-start gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowDown} />
                <span>Bajar posición</span>
              </button>

              <button
                type="button"
                onClick={handleEditarActividad}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-400 font-bold text-xs transition-colors flex items-center justify-start gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPen} />
                <span>Editar actividad</span>
              </button>

              <button
                type="button"
                onClick={handleEliminarActividad}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-start gap-3 cursor-pointer mt-2"
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>Borrar actividad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Fondo>
  );
}

export default HorarioTutor;