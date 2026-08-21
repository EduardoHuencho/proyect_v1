import NavbarDev from '../Components/NavbarDev';
import { useNino } from '../context/NinoContext';
import Fondo from '../Components/Fondo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faStar } from '@fortawesome/free-solid-svg-icons';
import lupa from '../assets/lupa.png';
import libro from '../assets/libro.png';

const manejarClickJuego = (juego) => {
  console.log(`Se hizo click en la tarjeta del juego: ${juego}`);
};

function MenuJuegos() {
  const { tutorAutenticado } = useNino();

  return (
    <Fondo>
      <NavbarDev
        rol={tutorAutenticado ? 'tutor' : 'nino'}
        rutaVolver={tutorAutenticado ? '/dashboardtutor' : '/menumodulos'}
        labelVolver={tutorAutenticado ? 'Menú' : 'Volver'}
      />

      <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] select-none">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B3A5C] mb-4 sm:mb-8 text-center">
          ¡A JUGAR!
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl justify-center items-stretch">
          
          <button
            type="button"
            onClick={() => manejarClickJuego('¿Qué es?')}
            className="group flex flex-col items-center bg-white p-4 sm:p-6 rounded-3xl sm:rounded-[30px] shadow-md sm:shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left focus:outline-none w-full"
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
              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600">
                VER IMAGEN
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5"
              />

              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600">
                ELEGIR RESPUESTA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5"
              />

              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-[#1B3A5C] mt-3 sm:mt-6 tracking-wide w-full text-center uppercase">
              ¿QUÉ ES?
            </h2>
          </button>

          <button
            type="button"
            onClick={() => manejarClickJuego('Cuentitos')}
            className="group flex flex-col items-center bg-white p-4 sm:p-6 rounded-3xl sm:rounded-[30px] shadow-md sm:shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left focus:outline-none w-full"
            style={{ borderColor: '#E91E8C' }}
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-6 bg-pink-50 border-3 sm:border-4 border-[#FDD835] shadow-sm sm:shadow-md overflow-hidden shrink-0">
              <img
                src={libro}
                alt="Juego Cuentitos"
                className="w-full h-full object-cover p-1.5 sm:p-2"
              />
            </div>

            <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full flex-1 justify-center">
              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600">
                LEER CUENTO
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5"
              />

              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600">
                VER LA ESCENA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-[10px] sm:text-xs my-0 sm:my-0.5"
              />

              <div className="w-full max-w-55 sm:max-w-xs py-1.5 sm:py-2.5 rounded-full text-center font-bold text-[11px] sm:text-xs bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-[#1B3A5C] mt-3 sm:mt-6 tracking-wide w-full text-center uppercase">
              CUENTITOS
            </h2>
          </button>
        </div>
      </div>
    </Fondo>
  );
}

export default MenuJuegos;