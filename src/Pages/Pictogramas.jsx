import React, { useState, useEffect, useRef } from 'react';
import PictogramaCard from '../Components/PictogramaCard';
import CategoriaCard from '../Components/CategoriaCard';
import PictogramasList from '../Data/Pictogramas.json';
import CategoriasList from '../Data/Categorias.json';
import NinosList from '../Data/Ninos.json';
import NavbarDev from '../Components/NavbarDev';
import { useNino } from '../context/NinoContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fondo from '../Components/Fondo';
import { useNavigate } from 'react-router';
import {
  faVolumeHigh,
  faTrashCan,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';

function Pictogramas() {
  const navigate = useNavigate();
  const { tutorAutenticado, tutorOrigen, ninoActivo, setNinoActivo } =
    useNino();
  const [frase, setFrase] = useState([]);
  const [vozAmigable, setVozAmigable] = useState(null);
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
      setVozAmigable(mejorVoz);
    };
    configurarVoz();
    window.speechSynthesis.onvoiceschanged = configurarVoz;
  }, []);

  const pictogramaHandler = (pictograma) => {
    setFrase([...frase, pictograma]);
    console.log('Enviando ID al backend simulado:', pictograma.id);
  };

  const pictogramaLastDelete = () => {
    if (frase.length === 0) return;
    setFrase(frase.slice(0, -1));
  };

  const pictogramaClearAll = () => {
    setFrase([]);
    if (contenedorFraseRef.current) {
      contenedorFraseRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const reproducirFrase = () => {
    if (frase.length === 0) return;
    const textoAHeber = frase.map((pic) => pic.label).join(' ');
    const mensaje = new SpeechSynthesisUtterance(textoAHeber);
    if (vozAmigable) {
      mensaje.voice = vozAmigable;
      mensaje.lang = vozAmigable.lang;
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
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <NavbarDev
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={true}
          rutaVolver={
            tutorAutenticado
              ? tutorOrigen === 'global'
                ? '/page4'
                : null
              : '/page2'
          }
          labelVolver={tutorOrigen === 'global' ? 'Menú' : 'Volver'}
          pinSoloDesbloquea={true}
        />

        <div className="p-4 md:p-6 select-none flex-1 flex flex-col overflow-hidden">
          {tutorAutenticado && (
            <div className="border border-gray-100 bg-gray-50/50 rounded-2xl h-[75px] mb-4 flex items-center p-2 gap-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent shrink-0">
              {NinosList.map((nino) => (
                <button
                  key={nino.id_infante}
                  onClick={() => setNinoActivo(nino)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shrink-0 whitespace-nowrap"
                  style={{
                    background:
                      ninoActivo?.id_infante === nino.id_infante
                        ? '#FDD835'
                        : 'transparent',
                    color: '#1B3A5C',
                    border: '2px solid',
                    borderColor:
                      ninoActivo?.id_infante === nino.id_infante
                        ? '#FDD835'
                        : '#CBD5E0',
                  }}
                >
                  <span>{nino.avatar_url}</span>
                  <span>{nino.nombre}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border border-black bg-white rounded-2xl h-[125px] mb-4 flex items-center justify-between p-3 gap-3 shadow-sm overflow-hidden shrink-0">
            <div
              ref={contenedorFraseRef}
              className="flex flex-nowrap items-center gap-3 flex-grow overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent h-full max-h-full pb-1 pr-2"
            >
              {frase.length === 0 ? (
                <p className="text-gray-400 font-medium text-sm sm:text-base pl-2 whitespace-nowrap">
                  Toca los pictogramas para crear tu frase...
                </p>
              ) : (
                frase.map((pic, index) => (
                  <div
                    key={index}
                    className="p-1.5 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-between w-16 sm:w-20 h-[95px] shrink-0 animate-fade-in overflow-hidden"
                  >
                    <div className="h-11 w-11 flex items-center justify-center overflow-hidden mt-0.5 shrink-0">
                      <img
                        src={pic.icon}
                        alt={pic.label}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/100x100?text=🖼️';
                        }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700 w-full text-center leading-tight line-clamp-2 break-words hyphens-auto mb-0.5">
                      {pic.label}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={reproducirFrase}
                disabled={frase.length === 0}
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md transition-all active:scale-95 ${
                  frase.length > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
                title="Escuchar frase en voz alta"
              >
                <FontAwesomeIcon icon={faVolumeHigh} />
              </button>

              <button
                onClick={pictogramaClearAll}
                disabled={frase.length === 0}
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md transition-all active:scale-95 ${
                  frase.length > 0
                    ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
                title="Limpiar toda la frase"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>

              <button
                onClick={pictogramaLastDelete}
                disabled={frase.length === 0}
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md transition-all active:scale-95 ${
                  frase.length > 0
                    ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-200'
                }`}
                title="Borrar último pictograma"
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>
            </div>
          </div>

          {tutorAutenticado && (
            <div className="mb-4 shrink-0">
              <button className="w-full border-2 border-dashed border-[#1A7A6E] rounded-2xl py-3 text-[#1A7A6E] font-bold text-sm hover:bg-[#1A7A6E]/5 transition-all">
                + Agregar pictograma
              </button>
            </div>
          )}

          <div className="border border-gray-100 bg-gray-50/50 rounded-2xl h-[75px] mb-5 flex items-center p-2 gap-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent shrink-0">
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
                    console.log('Filtrando por categoría ID:', cat.id);
                  }}
                />
              );
            })}
          </div>

          <div className="flex-grow overflow-y-auto pr-1 pb-4 scrollbar-thin">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {pictogramasFiltrados.map((item) => (
                <PictogramaCard
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  color={item.color}
                  star={item.star}
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
