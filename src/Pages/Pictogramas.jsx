import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import PictogramaCard from '../Components/PictogramaCard';
import CategoriaCard from '../Components/CategoriaCard';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { usePictogramas } from '../context/PictogramasContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fondo from '../Components/Fondo';
import Avatar from '../assets/panda.png';
import {
  faVolumeHigh,
  faTrashCan,
  faDeleteLeft,
  faGear,
} from '@fortawesome/free-solid-svg-icons';

const COLOR_CATEGORIA_FIJO = '#E0F7FA';

const obtenerImagenAvatar = (avatarUrl) => {
  if (avatarUrl && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  return Avatar;
};

function Pictogramas() {
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const {
    tutorAutenticado,
    tutorOrigen,
    ninoActivo,
    setNinoActivo,
    ninos,
    loadingNinos,
    cargarNinos,
  } = useNino();

  const { pictogramas, loadingPictogramas, cargarPictogramas } = usePictogramas();

  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [frase, setFrase] = useState([]);
  const vozAmigableRef = useRef(null);
  const contenedorFraseRef = useRef(null);

  useEffect(() => {
    if (tutorAutenticado && ninos.length === 0) {
      const idPadre = localStorage.getItem('userId') || userId;
      if (idPadre) {
        cargarNinos(idPadre);
      }
    }
  }, [tutorAutenticado, ninos.length, userId, cargarNinos]);

  useEffect(() => {
    const idPadre = localStorage.getItem('userId') || userId;
    if (idPadre) {
      cargarPictogramas(idPadre);
    }
  }, [userId, cargarPictogramas]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const response = await fetch('http://localhost:3000/category', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error('Error al cargar las categorías');
        const data = await response.json();

        let lista = [];
        if (Array.isArray(data)) {
          lista = data;
        } else if (Array.isArray(data.data)) {
          lista = data.data;
        }

        setCategorias(lista);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [token]);

  useEffect(() => {
    const configurarVoz = () => {
      const vocesDisponibles = window.speechSynthesis.getVoices();
      const vocesEspanol = vocesDisponibles.filter((voz) =>
        voz.lang.startsWith('es')
      );
      const mejorVoz =
        vocesEspanol.find(
          (voz) =>
            voz.name.includes('Google') ||
            voz.name.includes('Sabina') ||
            voz.name.includes('Monica') ||
            voz.name.includes('Paulina')
        ) || vocesEspanol[0];
      vozAmigableRef.current = mejorVoz;
    };
    configurarVoz();
    window.speechSynthesis.onvoiceschanged = configurarVoz;
  }, []);

  const pictogramaHandler = (pictograma) => {
    setFrase((prevFrase) => [
      ...prevFrase,
      { ...pictograma, phraseId: crypto.randomUUID() },
    ]);
  };

  const pictogramaLastDelete = () => {
    if (frase.length === 0) return;
    setFrase((prevFrase) => prevFrase.slice(0, -1));
  };

  const pictogramaClearAll = () => {
    setFrase([]);
    if (contenedorFraseRef.current) {
      contenedorFraseRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const reproducirFrase = () => {
    if (frase.length === 0) return;
    const textoAVoz = frase.map((pic) => pic.label).join(' ');
    const mensaje = new SpeechSynthesisUtterance(textoAVoz);
    if (vozAmigableRef.current) {
      mensaje.voice = vozAmigableRef.current;
      mensaje.lang = vozAmigableRef.current.lang;
    } else {
      mensaje.lang = 'es-ES';
    }
    mensaje.rate = 0.6;
    mensaje.pitch = 1.3;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(mensaje);
  };

  useEffect(() => {
    if (contenedorFraseRef.current && frase.length > 0) {
      contenedorFraseRef.current.scrollTo({
        left: contenedorFraseRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [frase]);

  const pictogramasFiltrados = categoriaSeleccionada
    ? pictogramas.filter(
        (item) => String(item.categoryId).trim() === String(categoriaSeleccionada).trim()
      )
    : pictogramas;

  return (
    <Fondo>
      <div className="flex flex-col h-screen overflow-hidden landscape:max-md:h-auto landscape:max-md:min-h-screen landscape:max-md:overflow-y-auto">
        <Navbar
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={true}
          rutaVolver={
            tutorAutenticado
              ? tutorOrigen === 'global'
                ? '/dashboardtutor'
                : null
              : '/menumodulos'
          }
          labelVolver={tutorOrigen === 'global' ? 'Menú' : 'Volver'}
          pinSoloDesbloquea={true}
        />

        <div className="p-4 md:p-6 select-none flex-1 flex flex-col overflow-hidden landscape:max-md:overflow-visible">
          {/* Selector de niños */}
          {tutorAutenticado && (
            <div className="barra-scroll-horizontal mb-4 shrink-0">
              {loadingNinos ? (
                <span className="text-xs font-bold text-[#1B3A5C] px-3">
                  Cargando niños...
                </span>
              ) : (
                ninos.map((nino) => {
                  const activo = ninoActivo?.id === nino.id;
                  return (
                    <button
                      type="button"
                      key={nino.id}
                      onClick={() => setNinoActivo(nino)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-sm transition-colors shrink-0 whitespace-nowrap text-[#1B3A5C] border-2 ${
                        activo
                          ? 'bg-[#FDD835] border-[#FDD835]'
                          : 'bg-transparent border-[#CBD5E0]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white border border-[#1B3A5C]/30 shrink-0">
                        <img
                          src={obtenerImagenAvatar(nino.avatarUrl)}
                          alt={nino.firstName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = Avatar;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>
                        {nino.firstName} {nino.lastName || ''}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}

          <div className="border border-black bg-white min-h-36.25 sm:min-h-40 rounded-2xl mb-4 flex items-center justify-between p-3 sm:p-4 gap-3 shadow-sm overflow-hidden shrink-0">
            <div
              ref={contenedorFraseRef}
              className="flex flex-nowrap items-center gap-2.5 sm:gap-3.5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent h-full max-h-full py-1 pr-1"
            >
              {frase.length === 0 ? (
                <p className="text-gray-400 font-medium text-xs sm:text-base pl-2 whitespace-nowrap">
                  Toca los pictogramas para crear tu frase...
                </p>
              ) : (
                frase.map((pic) => (
                  <div
                    key={pic.phraseId}
                    className="p-1.5 sm:p-2 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-between w-20 h-28 sm:w-24 sm:h-32 shrink-0 animate-fade-in overflow-hidden"
                  >
                    <div className="w-full flex-1 flex items-center justify-center overflow-hidden min-h-0">
                      <img
                        src={pic.icon}
                        alt={pic.label}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/100x100?text=🖼️';
                        }}
                      />
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-700 w-full text-center leading-tight line-clamp-2 wrap-break-words hyphens-auto px-0.5 mt-1 shrink-0">
                      {pic.label}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={reproducirFrase}
                disabled={frase.length === 0}
                aria-label="Escuchar frase en voz alta"
                title="Escuchar frase en voz alta"
                className={`btn-accion-frase ${
                  frase.length > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={faVolumeHigh} />
              </button>

              <button
                type="button"
                onClick={pictogramaClearAll}
                disabled={frase.length === 0}
                aria-label="Limpiar toda la frase"
                title="Limpiar toda la frase"
                className={`btn-accion-frase ${
                  frase.length > 0
                    ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>

              <button
                type="button"
                onClick={pictogramaLastDelete}
                disabled={frase.length === 0}
                aria-label="Borrar último pictograma"
                title="Borrar último pictograma"
                className={`btn-accion-frase ${
                  frase.length > 0
                    ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>
            </div>
          </div>

          {tutorAutenticado && (
            <div className="mb-4 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/crearpictograma')}
                className="w-full border-2 border-dashed border-[#1A7A6E] rounded-2xl py-3 text-[#1A7A6E] font-bold text-sm hover:bg-[#1A7A6E]/5 transition-colors cursor-pointer"
              >
                + Agregar pictograma
              </button>
            </div>
          )}

          <div className="barra-scroll-horizontal mb-5 shrink-0">
            {loadingCategorias ? (
              <span className="text-xs font-bold text-[#1B3A5C] px-3">
                Cargando categorías...
              </span>
            ) : (
              <>
                {categorias.map((cat) => {
                  const activo = String(categoriaSeleccionada) === String(cat.id);

                  return (
                    <CategoriaCard
                      key={cat.id}
                      label={cat.categoryName}
                      color={COLOR_CATEGORIA_FIJO}
                      activo={activo}
                      onClick={() => {
                        setCategoriaSeleccionada((prev) =>
                          prev === String(cat.id) ? null : String(cat.id)
                        );
                      }}
                    />
                  );
                })}

                <CategoriaCard
                  key="cat-todos"
                  label="Todos"
                  color={COLOR_CATEGORIA_FIJO}
                  activo={categoriaSeleccionada === null}
                  onClick={() => setCategoriaSeleccionada(null)}
                />
              </>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto landscape:max-md:overflow-visible landscape:max-md:flex-none pr-1 pb-4 scrollbar-thin">
            {loadingPictogramas ? (
              <div className="flex items-center justify-center h-32">
                <span className="text-sm font-bold text-[#1B3A5C]">
                  Cargando pictogramas...
                </span>
              </div>
            ) : pictogramasFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  No hay pictogramas en esta categoría.
                </p>
                {tutorAutenticado && (
                  <button
                    type="button"
                    onClick={() => navigate('/crearpictograma')}
                    className="text-xs font-bold text-[#1A7A6E] hover:underline cursor-pointer"
                  >
                    Crear el primero ahora
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {pictogramasFiltrados.map((item) => (
                  <div key={item.id} className="relative group">
                    <PictogramaCard
                      label={item.label}
                      icon={item.icon}
                      onClick={() => pictogramaHandler(item)}
                    />

                    {tutorAutenticado && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editarpictograma/${item.id}`);
                        }}
                        aria-label={`Editar pictograma ${item.label}`}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 text-[#1B3A5C] border border-[#CBD5E0] shadow-md flex items-center justify-center text-xs hover:bg-[#1B3A5C] hover:text-white transition-colors z-10 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default Pictogramas;