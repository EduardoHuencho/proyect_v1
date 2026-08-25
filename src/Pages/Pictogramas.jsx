import { useState, useEffect, useRef } from 'react';
import PictogramaCard from '../Components/PictogramaCard';
import CategoriaCard from '../Components/CategoriaCard';
import PictogramasList from '../Data/Pictogramas.json';
import CategoriasList from '../Data/Categorias.json';
import NinosList from '../Data/Ninos.json';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fondo from '../Components/Fondo';
import {
  faVolumeHigh,
  faTrashCan,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';

function Pictogramas() {
  const { tutorAutenticado, tutorOrigen, ninoActivo, setNinoActivo } =
    useNino();
  const [frase, setFrase] = useState([]);
  const vozAmigableRef = useRef(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const contenedorFraseRef = useRef(null);

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

  const pictogramasFiltrados =
    String(categoriaSeleccionada).toLowerCase() === 'todos' ||
    String(categoriaSeleccionada) === '1'
      ? PictogramasList
      : PictogramasList.filter(
          (item) => String(item.categoryId) === String(categoriaSeleccionada)
        );

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
          {tutorAutenticado && (
            <div className="barra-scroll-horizontal mb-4 shrink-0">
              {NinosList.map((nino) => {
                const activo = ninoActivo?.id_infante === nino.id_infante;
                return (
                  <button
                    type="button"
                    key={nino.id_infante}
                    onClick={() => setNinoActivo(nino)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shrink-0 whitespace-nowrap text-[#1B3A5C] border-2 ${
                      activo
                        ? 'bg-[#FDD835] border-[#FDD835]'
                        : 'bg-transparent border-[#CBD5E0]'
                    }`}
                  >
                    <span>{nino.avatar_url}</span>
                    <span>{nino.nombre}</span>
                  </button>
                );
              })}
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
                className="w-full border-2 border-dashed border-[#1A7A6E] rounded-2xl py-3 text-[#1A7A6E] font-bold text-sm hover:bg-[#1A7A6E]/5 transition-colors"
              >
                + Agregar pictograma
              </button>
            </div>
          )}

          <div className="barra-scroll-horizontal mb-5 shrink-0">
            {CategoriasList.map((cat) => {
              const esTodosActivo =
                String(cat.id) === '1' &&
                String(categoriaSeleccionada).toLowerCase() === 'todos';
              const esIdCoincidente =
                String(categoriaSeleccionada).toLowerCase() ===
                String(cat.id).toLowerCase();

              return (
                <CategoriaCard
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon}
                  color={cat.color}
                  activo={esTodosActivo || esIdCoincidente}
                  onClick={() => {
                    setCategoriaSeleccionada(cat.id);
                  }}
                />
              );
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto landscape:max-md:overflow-visible landscape:max-md:flex-none pr-1 pb-4 scrollbar-thin">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {pictogramasFiltrados.map((item) => (
                <PictogramaCard
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  color={item.color}
                  onClick={() => pictogramaHandler(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default Pictogramas;