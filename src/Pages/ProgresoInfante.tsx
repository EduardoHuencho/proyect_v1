import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faChevronDown,
  faUser,
  faExclamationTriangle,
  faArrowRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';
import Fondo from '../Components/Fondo';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { getInfantProgress } from '../services/progressService';
import type { CategoriaProgreso } from '../types/progreso';

// --- Types ---
export type EstadoCategoria = 'LOGRADO' | 'NECESITA REPASO' | 'CON PARTIDAS' | 'SIN PARTIDAS';

export interface CategoriaMetrica {
  id: string;
  nombre: string;
  correctas: number;
  intentos: number;
  porcentaje: number;
  estado: EstadoCategoria;
  color?: string;
}

const calcularPorcentaje = (correctas: number, totales: number) =>
  totales > 0 ? Math.round((correctas / totales) * 100) : 0;

const obtenerEstadoCategoria = (porcentaje: number, totales: number): EstadoCategoria => {
  if (totales === 0) return 'SIN PARTIDAS';
  if (porcentaje >= 80) return 'LOGRADO';
  if (porcentaje < 60) return 'NECESITA REPASO';
  return 'CON PARTIDAS';
};

const getBadgeStyle = (estado: EstadoCategoria) => {
  switch (estado) {
    case 'LOGRADO':
      return 'bg-[#E2F1E7] text-[#1E5631]';
    case 'NECESITA REPASO':
      return 'bg-[#FFF3D6] text-[#A36A00]';
    case 'CON PARTIDAS':
    case 'SIN PARTIDAS':
    default:
      return 'bg-[#F1F5F9] text-[#64748B]';
  }
};

const getBarColor = (estado: EstadoCategoria) => {
  switch (estado) {
    case 'LOGRADO':
    case 'CON PARTIDAS':
      return 'bg-[#2A7261]';
    case 'NECESITA REPASO':
      return 'bg-[#D97706]';
    case 'SIN PARTIDAS':
    default:
      return 'bg-gray-200';
  }
};

export function ProgresoInfante() {
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const { ninos, loadingNinos, cargarNinos, ninoActivo, setNinoActivo } = useNino();

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [categoriasRaw, setCategoriasRaw] = useState<CategoriaProgreso[]>([]);
  const [cargandoProgreso, setCargandoProgreso] = useState(false);
  const [errorProgreso, setErrorProgreso] = useState<string | null>(null);

  const infanteActual = ninoActivo || (ninos.length > 0 ? ninos[0] : null);

  // Asegurar carga de infantes si aún no están en memoria
  useEffect(() => {
    if (userId && ninos.length === 0) {
      void cargarNinos(userId);
    }
  }, [userId, ninos.length, cargarNinos]);

  // Cargar progreso del infante seleccionado dinámicamente
  useEffect(() => {
    if (!infanteActual?.id) return;

    let montado = true;

    const cargar = async () => {
      try {
        setCargandoProgreso(true);
        setErrorProgreso(null);
        const data = await getInfantProgress(infanteActual.id, token);
        if (montado) {
          setCategoriasRaw(data);
        }
      } catch (err) {
        console.error('Error al cargar progreso del infante:', err);
        if (montado) {
          setErrorProgreso('No se pudieron obtener las estadísticas del infante.');
        }
      } finally {
        if (montado) {
          setCargandoProgreso(false);
        }
      }
    };

    void cargar();

    return () => {
      montado = false;
    };
  }, [infanteActual?.id, token]);

  // Mapear categorías con métricas calculadas
  const categorias: CategoriaMetrica[] = categoriasRaw.map((cat) => {
    const porcentaje = calcularPorcentaje(cat.correctas, cat.totales);
    const estado = obtenerEstadoCategoria(porcentaje, cat.totales);

    return {
      id: cat.id,
      nombre: cat.nombre.toUpperCase(),
      correctas: cat.correctas,
      intentos: cat.totales,
      porcentaje,
      estado,
      color: cat.color,
    };
  });

  // Computed values
  const totalCorrectas = categorias.reduce((acc, c) => acc + c.correctas, 0);
  const totalIntentos = categorias.reduce((acc, c) => acc + c.intentos, 0);
  const porcentajeGlobal =
    totalIntentos > 0 ? Math.round((totalCorrectas / totalIntentos) * 100) : 0;

  const categoriasAtencion = categorias.filter((c) => c.estado === 'NECESITA REPASO');

  return (
    <Fondo>
      <Navbar rol="tutor" rutaVolver="/dashboardtutor" labelVolver="Volver" />

      <div className="min-h-[calc(100vh-80px)] bg-[#BDE3E0]/30 p-4 sm:p-6 lg:p-8 font-sans text-[#1B3A5C]">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {/* 1. HEADER SECTION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-xs border border-teal-100 flex items-center justify-center text-[#1B3A5C]">
                <FontAwesomeIcon icon={faChartSimple} className="text-xl text-[#2A7261]" />
              </div>
              <div>
                <span className="text-[11px] font-black tracking-wider text-[#2A7261] uppercase block">
                  MÓDULO 4 · VISTA DEL TUTOR
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1B3A5C] leading-none">
                  ANÁLISIS DE JUEGOS
                </h1>
                <p className="text-xs font-bold text-gray-500 mt-1 uppercase">
                  REVISA SUS ACIERTOS Y DESCUBRE QUÉ REFORZAR.
                </p>
              </div>
            </div>

            {/* Child Selector Dropdown */}
            <div className="relative w-full sm:w-auto">
              <span className="text-[10px] font-black text-gray-500 tracking-wider block mb-1 uppercase">
                SELECCIÓN DEL NIÑO
              </span>
              <button
                type="button"
                onClick={() => setDropdownAbierto(!dropdownAbierto)}
                className="w-full sm:w-60 bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-gray-200 flex items-center justify-between gap-3 cursor-pointer hover:border-teal-400 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {infanteActual?.avatarUrl ? (
                      <img
                        src={infanteActual.avatarUrl}
                        alt={infanteActual.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} />
                    )}
                  </div>
                  <span className="font-black text-sm text-[#1B3A5C] truncate">
                    {infanteActual
                      ? `${infanteActual.firstName} ${infanteActual.lastName}`.toUpperCase()
                      : 'SELECCIONA UN INFANTE'}
                  </span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400 shrink-0" />
              </button>

              {dropdownAbierto && (
                <div className="absolute top-full right-0 mt-2 w-full sm:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-30 max-h-60 overflow-y-auto">
                  {ninos.length === 0 ? (
                    <div className="px-4 py-2.5 text-xs font-bold text-gray-400">
                      Sin infantes registrados
                    </div>
                  ) : (
                    ninos.map((nino) => (
                      <button
                        key={nino.id}
                        type="button"
                        onClick={() => {
                          setNinoActivo(nino);
                          setDropdownAbierto(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-black hover:bg-teal-50 flex items-center gap-2.5 transition-colors cursor-pointer ${
                          infanteActual?.id === nino.id
                            ? 'text-[#2A7261] bg-teal-50/70'
                            : 'text-[#1B3A5C]'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] shrink-0 overflow-hidden">
                          {nino.avatarUrl ? (
                            <img
                              src={nino.avatarUrl}
                              alt={nino.firstName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUser} />
                          )}
                        </div>
                        <span className="truncate">
                          {nino.firstName} {nino.lastName}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ESTADOS DE CARGA, VACÍOS O ERROR */}
          {loadingNinos || cargandoProgreso ? (
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs border border-teal-100/60">
              <div className="w-10 h-10 border-4 border-[#2A7261] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-black text-[#1B3A5C]">Cargando estadísticas del infante...</p>
            </div>
          ) : ninos.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 shadow-sm border border-gray-100 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1B3A5C] flex items-center justify-center text-2xl border-2 border-blue-200">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <h3 className="text-xl font-black text-[#1B3A5C]">No tienes infantes registrados</h3>
              <p className="text-xs text-gray-500 font-bold">
                Para visualizar estadísticas de progreso, primero debes crear el perfil de un infante.
              </p>
              <button
                type="button"
                onClick={() => navigate('/crearnino')}
                className="mt-2 py-3 px-6 rounded-2xl bg-[#FFD57E] text-[#1B3A5C] font-black text-sm border-2 border-[#1B3A5C] shadow-[0_4px_0_#1B3A5C] hover:scale-102 active:scale-95 transition-transform cursor-pointer"
              >
                Registrar nuevo infante
              </button>
            </div>
          ) : errorProgreso ? (
            <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 shadow-sm border border-red-100">
              <p className="text-sm text-red-600 font-extrabold">{errorProgreso}</p>
              <button
                type="button"
                onClick={() => {
                  if (infanteActual?.id) {
                    setCargandoProgreso(true);
                    setErrorProgreso(null);
                    getInfantProgress(infanteActual.id, token)
                      .then(setCategoriasRaw)
                      .catch((e) => {
                        console.error(e);
                        setErrorProgreso('No se pudieron obtener las estadísticas.');
                      })
                      .finally(() => setCargandoProgreso(false));
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-black text-[#1B3A5C] transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowRotateRight} />
                <span>Reintentar</span>
              </button>
            </div>
          ) : (
            <>
              {/* 2. TOP BANNER / SUMMARY CARD */}
              <div className="bg-[#E4F2EB] rounded-3xl p-6 sm:p-7 shadow-xs border border-teal-100/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left info */}
                <div className="md:col-span-5 flex flex-col gap-2">
                  <h2 className="text-lg font-black text-[#1B3A5C] tracking-wide uppercase">
                    PROGRESO DE {infanteActual?.firstName ? infanteActual.firstName.toUpperCase() : 'EL INFANTE'}
                  </h2>
                  <p className="text-xs font-extrabold text-gray-500 uppercase tracking-tight">
                    {totalCorrectas} RESPUESTAS CORRECTAS DE {totalIntentos} INTENTOS TOTALES.
                  </p>

                  {categoriasAtencion.length > 0 && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-[#FFF3D6] text-[#8C5800] px-3.5 py-1.5 rounded-full text-xs font-black w-fit shadow-2xs">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-xs" />
                      <span>
                        {categoriasAtencion.length}{' '}
                        {categoriasAtencion.length === 1
                          ? 'CATEGORÍA NECESITA ATENCIÓN'
                          : 'CATEGORÍAS NECESITAN ATENCIÓN'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Percentage Indicator */}
                <div className="md:col-span-3 flex flex-col justify-center border-y md:border-y-0 md:border-x border-teal-200/60 py-4 md:py-0 md:px-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-[#1B3A5C]">
                      {porcentajeGlobal}%
                    </span>
                    <span className="text-[10px] font-black text-gray-500 uppercase">
                      DE ACIERTOS
                    </span>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="w-full bg-gray-200/80 h-3 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-[#2A7261] h-full rounded-full transition-all duration-500"
                      style={{ width: `${porcentajeGlobal}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-gray-400 mt-1 uppercase tracking-wider block">
                    PORCENTAJE REDONDEADO
                  </span>
                </div>

                {/* Stat Cards Right */}
                <div className="md:col-span-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-start justify-center">
                    <span className="text-3xl font-black text-[#2A7261]">{totalCorrectas}</span>
                    <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase mt-1">
                      CORRECTAS
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex flex-col items-start justify-center">
                    <span className="text-3xl font-black text-[#1B3A5C]">{totalIntentos}</span>
                    <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase mt-1">
                      INTENTOS
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. MAIN CONTENT GRID (2 COLUMNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: Main Table Card */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-black text-[#1B3A5C]">RESULTADOS POR CATEGORÍA</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5">
                      COMPARA LOS ACIERTOS EN CADA TEMA DEL JUEGO.
                    </p>
                  </div>

                  {/* Table Header */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-125">
                      <thead>
                        <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider pb-3">
                          <th className="py-2 font-black">CATEGORÍA</th>
                          <th className="py-2 text-center font-black">CORRECTAS / INTENTOS</th>
                          <th className="py-2 font-black pl-4">ACIERTOS</th>
                          <th className="py-2 text-right font-black">ESTADO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {categorias.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-xs font-bold text-gray-400">
                              No hay categorías registradas.
                            </td>
                          </tr>
                        ) : (
                          categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                              {/* Category in rounded frame with database color */}
                              <td className="py-4">
                                <div
                                  className="inline-flex items-center px-4 py-2 rounded-2xl text-xs sm:text-sm font-black text-[#1B3A5C] border border-black/10 shadow-xs"
                                  style={{ backgroundColor: cat.color || '#E2E8F0' }}
                                >
                                  {cat.nombre}
                                </div>
                              </td>

                              {/* Score Ratio */}
                              <td className="py-4 text-center font-black text-xs sm:text-sm text-[#1B3A5C]">
                                {cat.correctas} / {cat.intentos}
                              </td>

                              {/* Progress Bar & Percentage */}
                              <td className="py-4 pl-4 min-w-35">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${getBarColor(cat.estado)}`}
                                      style={{ width: `${cat.porcentaje}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-black text-[#1B3A5C] w-9 text-right">
                                    {cat.porcentaje}%
                                  </span>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="py-4 text-right">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(
                                    cat.estado
                                  )}`}
                                >
                                  {cat.estado}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT COLUMN: What to Reinforce Sidebar Card */}
                <div className="lg:col-span-4 bg-[#FFFDE8] rounded-3xl p-6 sm:p-7 shadow-xs border border-amber-200/70 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-black text-[#1B3A5C]">¿QUÉ REFORZAR?</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">
                        UN POCO MÁS DE PRÁCTICA PARA SEGUIR APRENDIENDO.
                      </p>
                    </div>

                    {/* Items requiring attention */}
                    {categoriasAtencion.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-white border border-amber-100 text-center text-xs font-bold text-gray-500">
                        ¡Excelente! No hay categorías que requieran refuerzo urgente por ahora.
                      </div>
                    ) : (
                      categoriasAtencion.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white/80 rounded-2xl p-4 border border-amber-200/80 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="flex flex-col gap-1.5">
                            <div
                              className="inline-flex items-center w-fit px-3 py-1.5 rounded-xl font-black text-xs text-[#1B3A5C] border border-black/10 shadow-2xs"
                              style={{ backgroundColor: item.color || '#E2E8F0' }}
                            >
                              {item.nombre}
                            </div>
                            <p className="text-[11px] font-extrabold text-gray-400">
                              {item.correctas} DE {item.intentos} - {item.porcentaje}%
                            </p>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-[#FFF3D6] text-[#8C5800] shrink-0">
                            REPASO
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </Fondo>
  );
}

export default ProgresoInfante;
