import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBook,
  faArrowDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

function MenuJuegos() {
  const manejarClickJuego = (juego) => {
    console.log(`Se hizo click en la tarjeta del juego: ${juego}`);
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 w-full max-w-3xl items-start justify-center">
          <button
            onClick={() => manejarClickJuego("¿Qué es?")}
            className="group flex flex-col items-center bg-white p-6 rounded-[32px] border-2 border-b-8 border-gray-300 shadow-xl transition-all cursor-pointer text-left focus:outline-none active:translate-y-[4px] active:border-b-4 w-full"
          >
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6 w-16 h-16 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-3xl text-gray-700"
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full">
              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700">
                VER IMAGEN
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700">
                ELEGIR RESPUESTA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-black mt-6 tracking-wide text-gray-800 w-full text-center">
              ¿QUÉ ES?
            </h2>
          </button>

          <button
            onClick={() => manejarClickJuego("Cuentitos")}
            className="group flex flex-col items-center bg-white p-6 rounded-[32px] border-2 border-b-8 border-gray-300 shadow-xl transition-all cursor-pointer text-left focus:outline-none active:translate-y-[4px] active:border-b-4 w-full"
          >
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6 w-16 h-16 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBook}
                className="text-3xl text-gray-700"
              />
            </div>

            <div className="flex flex-col items-center gap-1.5 w-full">
              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700">
                LEER CUENTO
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700">
                VER LA ESCENA
              </div>

              <FontAwesomeIcon
                icon={faArrowDown}
                className="text-gray-400 text-xs my-0.5"
              />

              <div className="w-full max-w-xs py-3 rounded-full text-center font-bold text-sm bg-gray-50 border-2 border-gray-200 text-gray-700 flex items-center justify-center gap-1.5">
                <span>RESPONDER</span>
                <FontAwesomeIcon icon={faStar} className="text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-black mt-6 tracking-wide text-gray-800 w-full text-center">
              CUENTITOS
            </h2>
          </button>
        </div>
      </div>
    </>
  );
}

export default MenuJuegos;
