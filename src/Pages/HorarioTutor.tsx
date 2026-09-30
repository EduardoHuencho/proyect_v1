import { useState, useEffect } from 'react';
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
import type { ActividadHorarioBD } from '../types/horario';
import type { Pictograma } from '../types/pictograma';

const DIAS = [
  { clave: 'LUNES', abrev: 'Lun' },
  { clave: 'MARTES', abrev: 'Mar' },
  { clave: 'MIÉRCOLES', abrev: 'Mié' },
  { clave: 'JUEVES', abrev: 'Jue', esHoy: true },
  { clave: 'VIERNES', abrev: 'Vie' },
  { clave: 'SÁBADO', abrev: 'Sáb' },
  { clave: 'DOMINGO', abrev: 'Dom' },
];

const BLOQUES = [
  {
    clave: 'MAÑANA',
    etiqueta: 'Mañana',
    IconoLucide: Sun,
    colorIcono: 'text-yellow-500',
    colorFondo: 'bg-[#F0F8F8]/60',
  },
  {
    clave: 'TARDE',
    etiqueta: 'Tarde',
    IconoLucide: Sunset,
    colorIcono: 'text-amber-500',
    colorFondo: 'bg-[#FFFBEB]/60',
  },
  {
    clave: 'NOCHE',
    etiqueta: 'Noche',
    IconoLucide: Moon,
    colorIcono: 'text-indigo-500',
    colorFondo: 'bg-[#F0F4F8]/60',
  },
];

const horaABloque = (hora: string): 'MAÑANA' | 'TARDE' | 'NOCHE' => {
  const h = parseInt(hora.split(':')[0], 10);
  if (h < 12) return 'MAÑANA';
  if (h < 18) return 'TARDE';
  return 'NOCHE';
};

const DATOS_INICIALES: ActividadHorarioBD[] = [
  {
    id: '1',
    hour: '08:00',
    dayOfWeek: 'LUNES',
    infantId: 'infant-1',
    pictogramId: 'picto-1',
    pictogram: {
      id: 'picto-1',
      pictogramName: 'Levantarse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/120x120?text=⏰',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-1',
    },
  },
  {
    id: '2',
    hour: '09:00',
    dayOfWeek: 'LUNES',
    infantId: 'infant-1',
    pictogramId: 'picto-2',
    pictogram: {
      id: 'picto-2',
      pictogramName: 'Bañarse',
      personal: false,
      description: 'Higiene',
      pictoImageUrl: 'https://placehold.co/120x120?text=🛁',
      category: { id: 'cat-2', categoryName: 'Higiene' },
      pictoImageKey: 'k-2',
    },
  },
  {
    id: '3',
    hour: '10:00',
    dayOfWeek: 'LUNES',
    infantId: 'infant-1',
    pictogramId: 'picto-3',
    pictogram: {
      id: 'picto-3',
      pictogramName: 'Vestirse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/120x120?text=👕',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-3',
    },
  },
  {
    id: '4',
    hour: '08:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-1',
    pictogram: {
      id: 'picto-1',
      pictogramName: 'Levantarse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/120x120?text=⏰',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-1',
    },
  },
  {
    id: '5',
    hour: '09:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-2',
    pictogram: {
      id: 'picto-2',
      pictogramName: 'Bañarse',
      personal: false,
      description: 'Higiene',
      pictoImageUrl: 'https://placehold.co/120x120?text=🛁',
      category: { id: 'cat-2', categoryName: 'Higiene' },
      pictoImageKey: 'k-2',
    },
  },
  {
    id: '6',
    hour: '10:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-3',
    pictogram: {
      id: 'picto-3',
      pictogramName: 'Vestirse',
      personal: false,
      description: 'Rutina',
      pictoImageUrl: 'https://placehold.co/120x120?text=👕',
      category: { id: 'cat-1', categoryName: 'Rutina' },
      pictoImageKey: 'k-3',
    },
  },
  {
    id: '7',
    hour: '11:00',
    dayOfWeek: 'JUEVES',
    infantId: 'infant-1',
    pictogramId: 'picto-4',
    pictogram: {
      id: 'picto-4',
      pictogramName: 'Desayuno',
      personal: false,
      description: 'Comida',
      pictoImageUrl: 'https://placehold.co/120x120?text=🧃',
      category: { id: 'cat-3', categoryName: 'Comida' },
      pictoImageKey: 'k-4',
    },
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

  const [actividades, setActividades] = useState<ActividadHorarioBD[]>(DATOS_INICIALES);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadHorarioBD | null>(null);

  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);

  const handleAbrirFormulario = () => {
    setModalFormularioAbierto(true);
  };

  const handleGuardarActividad = (datos: {
    pictogramId?: string;
    pictograma?: Pictograma | null;
    titulo: string;
    jornada: 'MAÑANA' | 'TARDE' | 'NOCHE';
    dias: string[];
  }) => {
    const horaDefault =
      datos.jornada === 'MAÑANA' ? '08:00' : datos.jornada === 'TARDE' ? '14:00' : '20:00';

    const nuevasActividades: ActividadHorarioBD[] = datos.dias.map((dia) => {
      const pictogramaBase = datos.pictograma || {
        id: datos.pictogramId || 'picto-nuevo',
        pictogramName: datos.titulo, // <-- Aquí aseguramos que use el título del formulario
        personal: true,
        description: 'General',
        pictoImageUrl: 'https://placehold.co/120x120?text=📌',
        category: { id: 'cat-general', categoryName: 'General' },
        pictoImageKey: 'key-new',
      };

      return {
        id: crypto.randomUUID(),
        hour: horaDefault,
        dayOfWeek: dia,
        infantId: ninoActivo?.id || 'infant-local',
        pictogramId: pictogramaBase.id,
        pictogram: {
          ...pictogramaBase,
          pictogramName: datos.titulo, // Forzamos el nombre de la tarjeta al título ingresado
        },
      };
    });

    setActividades((prev) => [...prev, ...nuevasActividades]);
  };

  const handleMoverActividad = (direccion: 'SUBIR' | 'BAJAR') => {
    if (!actividadSeleccionada) return;

    setActividades((prev) => {
      const delMismoBloqueYDia = prev.filter(
        (a) =>
          a.dayOfWeek === actividadSeleccionada.dayOfWeek &&
          horaABloque(a.hour) === horaABloque(actividadSeleccionada.hour)
      );

      const idx = delMismoBloqueYDia.findIndex((a) => a.id === actividadSeleccionada.id);
      if (idx === -1) return prev;

      const targetIdx = direccion === 'SUBIR' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= delMismoBloqueYDia.length) return prev;

      const copia = [...prev];
      const actualIdxGlobal = copia.findIndex((a) => a.id === actividadSeleccionada.id);
      const destinoIdxGlobal = copia.findIndex((a) => a.id === delMismoBloqueYDia[targetIdx].id);

      const temp = copia[actualIdxGlobal];
      copia[actualIdxGlobal] = copia[destinoIdxGlobal];
      copia[destinoIdxGlobal] = temp;

      return copia;
    });

    setActividadSeleccionada(null);
  };

  const handleEditarActividad = () => {
    if (!actividadSeleccionada) return;
    const nuevoNombre = prompt(
      'Nuevo nombre para la actividad:',
      actividadSeleccionada.pictogram?.pictogramName
    );

    if (nuevoNombre && nuevoNombre.trim()) {
      setActividades((prev) =>
        prev.map((a) =>
          a.id === actividadSeleccionada.id && a.pictogram
            ? { ...a, pictogram: { ...a.pictogram, pictogramName: nuevoNombre.trim() } }
            : a
        )
      );
    }
    setActividadSeleccionada(null);
  };

  const handleEliminarActividad = () => {
    if (!actividadSeleccionada) return;
    setActividades((prev) => prev.filter((a) => a.id !== actividadSeleccionada.id));
    setActividadSeleccionada(null);
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
                onClick={handleAbrirFormulario}
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
                      const actividadesCelda = actividades.filter(
                        (a) => a.dayOfWeek === dia.clave && horaABloque(a.hour) === bloque.clave
                      );

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
                            onClick={handleAbrirFormulario}
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
            actividades={actividades}
          />
        </div>
      </div>

      <FormularioActividad
        isOpen={modalFormularioAbierto}
        onClose={() => setModalFormularioAbierto(false)}
        onGuardar={handleGuardarActividad}
        token={token}
      />

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
                <span>Editar nombre</span>
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