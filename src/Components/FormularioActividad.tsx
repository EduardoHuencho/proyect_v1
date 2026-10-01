import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import type { Categoria, Pictograma } from '../types/pictograma';
import type { ActividadRutinaVista } from '../types/horario';
import { getCategories, getPictograms, getPictogramsByInfantId } from '../services/pictogramsService';
import { TarjetaPictogramaHorarioForm } from './TarjetaPictogramaHorarioForm';

interface FormularioActividadProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (datos: {
    pictogramId?: string;
    pictograma?: Pictograma | null;
    titulo: string;
    jornada: 'MAÑANA' | 'TARDE' | 'NOCHE';
    dias: string[];
  }) => Promise<void> | void;
  token: string | null;
  infantId?: string | null;
  diaInicial?: string;
  jornadaInicial?: 'MAÑANA' | 'TARDE' | 'NOCHE';
  actividadInicial?: ActividadRutinaVista | null;
}

const DIAS = [
  { clave: 'LUNES', abrev: 'L' },
  { clave: 'MARTES', abrev: 'M' },
  { clave: 'MIÉRCOLES', abrev: 'M' },
  { clave: 'JUEVES', abrev: 'J' },
  { clave: 'VIERNES', abrev: 'V' },
  { clave: 'SÁBADO', abrev: 'S' },
  { clave: 'DOMINGO', abrev: 'D' },
];

const JORNADAS = [
  { clave: 'MAÑANA' as const, etiqueta: 'Mañana' },
  { clave: 'TARDE' as const, etiqueta: 'Tarde' },
  { clave: 'NOCHE' as const, etiqueta: 'Noche' },
];

const NUM_A_DIA: Record<number, string> = {
  1: 'LUNES',
  2: 'MARTES',
  3: 'MIÉRCOLES',
  4: 'JUEVES',
  5: 'VIERNES',
  6: 'SÁBADO',
  7: 'DOMINGO',
};

const STAGE_A_JORNADA: Record<string, 'MAÑANA' | 'TARDE' | 'NOCHE'> = {
  MORNING: 'MAÑANA',
  AFTERNOON: 'TARDE',
  NIGHT: 'NOCHE',
};

export function FormularioActividad({
  isOpen,
  onClose,
  onGuardar,
  token,
  infantId,
  diaInicial,
  jornadaInicial,
  actividadInicial,
}: FormularioActividadProps) {
  const esEdicion = Boolean(actividadInicial);

  const [titulo, setTitulo] = useState(actividadInicial?.name || '');
  const [jornada, setJornada] = useState<'MAÑANA' | 'TARDE' | 'NOCHE'>(() => {
    if (actividadInicial?.stage) {
      return STAGE_A_JORNADA[actividadInicial.stage] || 'MAÑANA';
    }
    return jornadaInicial || 'MAÑANA';
  });
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>(() => {
    if (actividadInicial?.dayOfWeek) {
      return [NUM_A_DIA[actividadInicial.dayOfWeek] || 'LUNES'];
    }
    return diaInicial ? [diaInicial] : ['LUNES'];
  });
  const [pictoSeleccionado, setPictoSeleccionado] = useState<Pictograma | null>(
    actividadInicial?.pictogram || null
  );
  const [guardando, setGuardando] = useState(false);

  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);

  const [modalPictoAbierto, setModalPictoAbierto] = useState(false);
  const [catFiltro, setCatFiltro] = useState<string>('TODAS');
  const [busquedaPicto, setBusquedaPicto] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    let cancelado = false;
    async function cargarDatos() {
      setCargando(true);
      try {
        const [publicos, privados, listaCats] = await Promise.all([
          getPictograms(token),
          infantId ? getPictogramsByInfantId(infantId, token) : Promise.resolve([] as Pictograma[]),
          getCategories(token),
        ]);
        if (!cancelado) {
          const mapaFinal = new Map<string, Pictograma>();
          for (const p of publicos) mapaFinal.set(p.id, p);
          for (const p of privados) mapaFinal.set(p.id, p);

          setPictogramas(Array.from(mapaFinal.values()));
          setCategorias(listaCats);
        }
      } catch (err) {
        console.error('Error al cargar pictogramas/categorías:', err);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarDatos();
    return () => {
      cancelado = true;
    };
  }, [isOpen, token, infantId]);

  if (!isOpen) return null;

  const toggleDia = (diaClave: string) => {
    setDiasSeleccionados((prev) =>
      prev.includes(diaClave) ? prev.filter((d) => d !== diaClave) : [...prev, diaClave]
    );
  };

  const handleSeleccionarPicto = (picto: Pictograma) => {
    setPictoSeleccionado(picto);
    if (!titulo.trim()) {
      setTitulo(picto.pictogramName);
    }
    setModalPictoAbierto(false);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pictoSeleccionado?.id) {
      alert('Debes seleccionar un pictograma para la actividad.');
      return;
    }
    if (!titulo.trim() || diasSeleccionados.length === 0) return;

    try {
      setGuardando(true);
      await onGuardar({
        pictogramId: pictoSeleccionado.id,
        pictograma: pictoSeleccionado,
        titulo: titulo.trim(),
        jornada,
        dias: diasSeleccionados,
      });
      onClose();
    } catch (err) {
      console.error('Error al guardar actividad:', err);
    } finally {
      setGuardando(false);
    }
  };

  const pictogramasFiltrados = pictogramas.filter((p) => {
    const coincideCat = catFiltro === 'TODAS' || p.category?.id === catFiltro;
    const coincideTexto = p.pictogramName.toLowerCase().includes(busquedaPicto.toLowerCase());
    return coincideCat && coincideTexto;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white max-w-sm w-full rounded-[35px] p-6 sm:p-7 shadow-2xl relative flex flex-col gap-5 border border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1B3A5C]">
            {esEdicion ? 'Editar actividad' : 'Nueva actividad'}
          </h2>

          <form onSubmit={handleGuardar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1B3A5C]">Pictograma</label>
              <button
                type="button"
                onClick={() => setModalPictoAbierto(true)}
                className="w-full bg-[#B0C8DC]/70 hover:bg-[#B0C8DC] border-2 border-[#7A9AB8] rounded-2xl p-2.5 flex items-center gap-3 transition-colors cursor-pointer text-[#003052]"
              >
                <div className="w-12 h-10 bg-white rounded-xl border-2 border-[#7A9AB8] flex items-center justify-center shrink-0 overflow-hidden">
                  {pictoSeleccionado?.pictoImageUrl ? (
                    <img
                      src={pictoSeleccionado.pictoImageUrl}
                      alt={pictoSeleccionado.pictogramName}
                      className="w-full h-full object-contain p-0.5"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faImage} className="text-gray-400 text-xl" />
                  )}
                </div>
                <span className="font-bold text-sm sm:text-base text-[#003052] truncate">
                  {pictoSeleccionado ? pictoSeleccionado.pictogramName : 'Elegir pictograma'}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1B3A5C]">Título</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Dormir"
                className="w-full bg-[#B0C8DC]/70 border-2 border-[#7A9AB8] rounded-2xl px-4 py-2.5 text-[#003052] font-extrabold text-sm sm:text-base outline-none text-center placeholder:text-[#003052]/50 focus:border-[#1B3A5C]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1B3A5C]">Jornada</label>
              <div className="grid grid-cols-3 gap-2">
                {JORNADAS.map((j) => (
                  <button
                    key={j.clave}
                    type="button"
                    onClick={() => setJornada(j.clave)}
                    className={`py-2 px-1 rounded-2xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                      jornada === j.clave
                        ? 'bg-[#1B3A5C] text-white border-[#1B3A5C] shadow-sm'
                        : 'bg-[#B0C8DC]/70 text-[#003052] border-[#7A9AB8] hover:bg-[#B0C8DC]'
                    }`}
                  >
                    {j.etiqueta}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B3A5C]">Días</label>
                {esEdicion && (
                  <span className="text-[10px] text-gray-500 font-bold">Día fijado en edición</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1">
                {DIAS.map((d) => {
                  const activo = diasSeleccionados.includes(d.clave);
                  return (
                    <button
                      key={d.clave}
                      type="button"
                      disabled={esEdicion}
                      onClick={() => !esEdicion && toggleDia(d.clave)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 font-black text-xs sm:text-sm transition-all flex items-center justify-center ${
                        esEdicion ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                      } ${
                        activo
                          ? 'bg-[#1B3A5C] text-white border-[#1B3A5C] shadow-xs'
                          : 'bg-[#B0C8DC]/70 text-[#003052] border-[#7A9AB8] hover:bg-[#B0C8DC]'
                      }`}
                    >
                      {d.abrev}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b-2 border-dashed border-sky-400 my-1" />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="py-3.5 rounded-2xl font-black text-base bg-[#FDD835] text-[#003052] border-2 border-[#C8A800] shadow-[0_4px_0_#C8A800] hover:scale-102 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={guardando}
                className="py-3.5 rounded-2xl font-black text-base bg-[#FDD835] text-[#003052] border-2 border-[#C8A800] shadow-[0_4px_0_#C8A800] hover:scale-102 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {modalPictoAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-60 p-4 animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-[30px] p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-hidden relative">
            <button
              type="button"
              onClick={() => setModalPictoAbierto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>

            <h3 className="text-xl font-black text-[#1B3A5C]">Seleccionar Pictograma</h3>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl border border-gray-200">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Buscar pictograma..."
                value={busquedaPicto}
                onChange={(e) => setBusquedaPicto(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#1B3A5C] outline-none w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1B3A5C] px-1">Filtrar por categoría</label>
              <select
                value={catFiltro}
                onChange={(e) => setCatFiltro(e.target.value)}
                className="w-full bg-[#B0C8DC]/70 border-2 border-[#7A9AB8] rounded-2xl px-4 py-2 text-[#003052] font-extrabold text-xs outline-none cursor-pointer"
              >
                <option value="TODAS">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto p-1 flex-1 min-h-55">
              {cargando ? (
                <div className="col-span-full text-center text-gray-400 font-bold text-xs py-10">
                  Cargando pictogramas...
                </div>
              ) : pictogramasFiltrados.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 font-bold text-xs py-10">
                  No se encontraron pictogramas.
                </div>
              ) : (
                pictogramasFiltrados.map((picto) => (
                  <TarjetaPictogramaHorarioForm
                    key={picto.id}
                    pictograma={picto}
                    seleccionado={pictoSeleccionado?.id === picto.id}
                    onClick={handleSeleccionarPicto}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}