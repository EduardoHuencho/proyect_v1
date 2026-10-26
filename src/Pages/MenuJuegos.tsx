import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../Components/Navbar';
import TarjetaPinTutor from '../Components/TarjetaPinTutor';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Fondo from '../Components/Fondo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faStar, faExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getCategories } from '../services/pictogramsService';
import type { Categoria } from '../types/pictograma';
import lupa from '../assets/lupa.png';

function MenuJuegos() {
  const { tutorAutenticado } = useNino();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modalAdvertenciaAbierto, setModalAdvertenciaAbierto] = useState(false);
  const [modalPinAbierto, setModalPinAbierto] = useState(false);
  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

  const cargarCategorias = useCallback(async () => {
    try {
      setCargandoCategorias(true);
      setErrorCategorias(null);
      const data = await getCategories(token);
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setErrorCategorias('No se pudieron cargar las categorías');
    } finally {
      setCargandoCategorias(false);
    }
  }, [token]);

  const handleAceptarAdvertencia = () => {
    setModalAdvertenciaAbierto(false);
    setModalPinAbierto(true);
  };

  const handlePinValido = () => {
    setModalPinAbierto(false);
    setModalCategoriaAbierto(true);
    if (categorias.length === 0) {
      cargarCategorias();
    }
  };

  const handleSeleccionarCategoria = (cat: Categoria) => {
    try {
      sessionStorage.removeItem('juego_que_es_estado');
    } catch (e) {
      console.error('Error al limpiar progreso previo del juego:', e);
    }
    setModalCategoriaAbierto(false);
    navigate('/juegoquees', {
      state: {
        categoriaId: cat.id,
        categoriaNombre: cat.categoryName,
        categoria: cat,
      },
    });
  };

  return (
    <Fondo>
      <Navbar
        rol={tutorAutenticado ? 'tutor' : 'nino'}
        rutaVolver={tutorAutenticado ? '/dashboardtutor' : '/menumodulos'}
        labelVolver={tutorAutenticado ? 'Menú' : 'Volver'}
      />

      <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] select-none">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3A5C] mb-4 sm:mb-8 text-center">
          ¡A JUGAR!
        </h1>

        <div className="w-full max-w-sm flex justify-center items-stretch">
          <button
            type="button"
            onClick={() => setModalAdvertenciaAbierto(true)}
            className="tarjeta-juego w-full"
            style={{ borderColor: '#1E88E5' }}
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-6 bg-blue-50 border-3 sm:border-4 border-[#FDD835] shadow-sm sm:shadow-md overflow-hidden shrink-0">
              <img
                src={lupa}
                alt="Juego ¿Qué es?"
                className="w-full h-full object-cover p-1.5 sm:p-2"
              />
            </div>

            <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full flex-1 justify-center">
              <div className="paso-juego">VER IMAGEN</div>
              <FontAwesomeIcon icon={faArrowDown} className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5" />
              <div className="paso-juego">ELEGIR RESPUESTA</div>
              <FontAwesomeIcon icon={faArrowDown} className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5" />
              <div className="paso-juego flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-[#1B3A5C] mt-3 sm:mt-6 tracking-wide w-full text-center uppercase">
              ¿QUÉ ES?
            </h2>
          </button>
        </div>
      </div>

      {modalAdvertenciaAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white max-w-sm w-full rounded-[35px] p-6 sm:p-7 shadow-2xl relative flex flex-col items-center text-center gap-4 border border-gray-100">
            <button
              type="button"
              onClick={() => setModalAdvertenciaAbierto(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#E0F7FA] text-[#0288D1] border-2 border-[#B2EBF2] flex items-center justify-center text-3xl shadow-xs mt-2">
              <FontAwesomeIcon icon={faExclamation} />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1B3A5C]">
                Atención
              </h3>
              <p className="text-sm sm:text-base font-extrabold text-[#1B3A5C] mt-2 px-2 leading-snug">
                Se recomienda la supervisión del tutor
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setModalAdvertenciaAbierto(false)}
                className="flex-1 py-3 px-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleAceptarAdvertencia}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#FDD835] text-[#003052] font-black text-sm border-2 border-[#C8A800] shadow-[0_3px_0_#C8A800] hover:scale-102 active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <TarjetaPinTutor
        isOpen={modalPinAbierto}
        onClose={() => setModalPinAbierto(false)}
        onSuccess={handlePinValido}
      />

      {modalCategoriaAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-[35px] p-6 sm:p-7 shadow-2xl relative flex flex-col gap-5 border border-gray-100">
            <button
              type="button"
              onClick={() => setModalCategoriaAbierto(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>

            <div>
              <h2 className="text-2xl font-black text-[#1B3A5C]">
                Selecciona una Categoría
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-1">
                Elige la categoría con la que deseas jugar
              </p>
            </div>

            {cargandoCategorias ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                <div className="w-8 h-8 border-3 border-[#1B3A5C] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold">Cargando categorías...</span>
              </div>
            ) : errorCategorias ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-red-500 font-bold text-center">{errorCategorias}</p>
                <button
                  type="button"
                  onClick={cargarCategorias}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1B3A5C] font-bold text-xs cursor-pointer transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : categorias.length === 0 ? (
              <div className="py-8 text-center text-gray-400 font-bold text-sm">
                No hay categorías disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1 scrollbar-thin">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSeleccionarCategoria(cat)}
                    className="p-3.5 rounded-2xl border-2 border-gray-200/80 hover:border-[#1B3A5C] flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-102 active:scale-95 shadow-xs cursor-pointer group bg-white"
                    style={cat.color ? { backgroundColor: `${cat.color}15`, borderColor: cat.color } : undefined}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-xs transition-transform group-hover:scale-110"
                      style={{ backgroundColor: cat.color || '#1B3A5C' }}
                    >
                      {cat.categoryName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-[#1B3A5C] truncate w-full">
                      {cat.categoryName}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalCategoriaAbierto(false)}
                className="py-2.5 px-5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Fondo>
  );
}

export default MenuJuegos;
