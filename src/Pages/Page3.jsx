import React from 'react';
import { useNavigate } from 'react-router';
import NavbarDev from '../Components/NavbarDev';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNino } from '../context/NinoContext';

function Page3() {
  const navigate = useNavigate();
  const { setTutorAutenticado, setTutorOrigen } = useNino();

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: '#E0F7FA',
        backgroundImage:
          'radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.07) 1.5px, transparent 0)',
        backgroundSize: '22px 22px',
      }}
    >
      <NavbarDev rol="tutor" />

      <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-2 text-center">
          Panel de Tutor
        </h1>
        <p className="text-[#4A7A96] mb-12 text-center">¿Qué deseas hacer?</p>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => navigate('/page4')}
            className="w-full bg-[#1A7A6E] hover:bg-[#15695F] active:scale-95 text-white rounded-2xl p-6 flex items-center gap-4 transition-all shadow-md"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faGrip} />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-lg">Ir al Dashboard Tutor</p>
              <p className="text-sm text-white/70">
                Ingreso al menu principal de modulos
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setTutorAutenticado(false);
              setTutorOrigen(null);
              navigate('/page1');
            }}
            className="w-full bg-white hover:bg-red-50 active:scale-95 border-2 border-[#E53935] rounded-2xl p-6 flex items-center gap-4 transition-all shadow-sm"
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-lg text-[#E53935]">
                Cerrar Sesión de Perfil
              </p>
              <p className="text-sm text-red-400">
                Volver a selección de niños
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page3;
