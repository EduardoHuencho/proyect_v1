import React from 'react';
import NavbarDev from '../Components/NavbarDev';
import { useNino } from '../context/NinoContext';
import Fondo from '../Components/Fondo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faStar } from '@fortawesome/free-solid-svg-icons';
import lupa from '../assets/lupa.png';
import libro from '../assets/libro.png';

function MenuJuegos() {
  const { tutorAutenticado } = useNino();

  const manejarClickJuego = (juego) => {
    console.log(`Se hizo click en la tarjeta del juego: ${juego}`);
  };

  return (
    <Fondo>
      <NavbarDev
        rol={tutorAutenticado ? 'tutor' : 'nino'}
        rutaVolver={tutorAutenticado ? '/page4' : '/page2'}
        labelVolver={tutorAutenticado ? 'Menú' : 'Volver'}
      />

      <div className="w-full max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] select-none">
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-8 text-center">
          ¡A JUGAR!
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl justify-center items-stretch">
          <button
            onClick={() => manejarClickJuego('¿Qué es?')}
            className="group flex flex-col items-center bg-white p-6 rounded-[30px] border-[4px] shadow-lg transition-all transform hover:scale-102 active:scale-98 cursor-pointer text-left focus:outline-none w-full"
            style={{ borderColor: '#1E88E5' }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-blue-50 border-4 border-[#FDD835] shadow-md overflow-hidden">
              <img
                src={lupa}
                alt="Juego ¿Qué es?"
                className="w-full h-full object-cover p-2"
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full flex-1 justify-center">
              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600">
                VER IMAGEN
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600">
                ELEGIR RESPUESTA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#1B3A5C] mt-6 tracking-wide w-full text-center uppercase">
              ¿QUÉ ES?
            </h2>
          </button>

          <button
            onClick={() => manejarClickJuego('Cuentitos')}
            className="group flex flex-col items-center bg-white p-6 rounded-[30px] border-[4px] shadow-lg transition-all transform hover:scale-102 active:scale-98 cursor-pointer text-left focus:outline-none w-full"
            style={{ borderColor: '#E91E8C' }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-pink-50 border-4 border-[#FDD835] shadow-md overflow-hidden">
              <img
                src={libro}
                alt="Juego Cuentitos"
                className="w-full h-full object-cover p-2"
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full flex-1 justify-center">
              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600">
                LEER CUENTO
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600">
                VER LA ESCENA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-2.5 rounded-full text-center font-bold text-xs bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#1B3A5C] mt-6 tracking-wide w-full text-center uppercase">
              CUENTITOS
            </h2>
          </button>
        </div>
      </div>
    </Fondo>
  );
}

export default MenuJuegos;
