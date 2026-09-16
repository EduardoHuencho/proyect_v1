import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faDoorOpen,
  faGear,
  faArrowLeft,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import TarjetaPinTutor from './TarjetaPinTutor';

interface NavbarProps {
  rol: 'selector' | 'nino' | 'tutor';
  rutaVolver?: string | null;
  labelVolver?: string;
  pinSoloDesbloquea?: boolean;
  esPictogramas?: boolean;
}

function Navbar({
  rol,
  rutaVolver = null,
  labelVolver = 'Volver',
  pinSoloDesbloquea = false,
  esPictogramas = false,
}: NavbarProps) {
  const navigate = useNavigate();
  const { tutorAutenticado, setTutorAutenticado, tutorOrigen, setTutorOrigen } =
    useNino();
  const { logout } = useAuth();
  const [mostrarPin, setMostrarPin] = useState(false);

  const handlePinValido = () => {
    setMostrarPin(false);
    setTutorAutenticado(true);
    if (pinSoloDesbloquea) {
      setTutorOrigen('local');
    } else {
      setTutorOrigen('global');
      navigate('/paneltutor');
    }
  };

  const handleSalirTutor = () => {
    setTutorAutenticado(false);
    setTutorOrigen(null);
    logout();
    navigate('/accesotutor');
  };

  const handleCerrarSesion = () => {
    logout();
    navigate('/');
  };

  const handleGuardarYSalir = () => {
    setTutorAutenticado(false);
    setTutorOrigen(null);
  };

  return (
    <>
      <nav className="bg-[#1B3A5C] px-4 py-3 flex items-center justify-between">
        <div className="w-16 md:w-44 flex justify-start">
          {rutaVolver && (
            <button
              onClick={() => navigate(rutaVolver)}
              className="btn-nav"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="hidden md:inline">{labelVolver}</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (tutorAutenticado && tutorOrigen === 'global') {
              navigate('/dashboardtutor');
            } else if (tutorAutenticado && tutorOrigen === 'local') {
              navigate('/menumodulos');
            } else {
              navigate('/menumodulos');
            }
          }}
          aria-label="Ir al inicio"
          className="hover:opacity-80 transition-opacity active:scale-95"
        >
          <img src={logoImg} alt="Logo TEAYUDO" className="h-8 md:h-10 w-auto" />
        </button>

        <div className="flex gap-2 w-16 md:w-44 justify-end">
          {rol === 'tutor' && (
            <>
              <div className="btn-nav hover:bg-[#2A4F73] cursor-default">
                <FontAwesomeIcon icon={faUserTie} />
                <span className="hidden md:inline">Tutor</span>
              </div>

              {esPictogramas && tutorOrigen === 'local' && (
                <button
                  onClick={handleGuardarYSalir}
                  className="btn-nav"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <span className="hidden md:inline">Guardar y salir</span>
                </button>
              )}

              {!esPictogramas && (
                <button
                  onClick={handleSalirTutor}
                  className="btn-nav"
                >
                  <FontAwesomeIcon icon={faDoorOpen} />
                  <span className="hidden md:inline">Salir</span>
                </button>
              )}
            </>
          )}

          {rol === 'selector' && (
            <button
              onClick={handleCerrarSesion}
              className="btn-nav"
            >
              <FontAwesomeIcon icon={faDoorOpen} />
              <span className="hidden md:inline">Salir</span>
            </button>
          )}

          {rol === 'nino' && (
            <button
              onClick={() => setMostrarPin(true)}
              aria-label="Abrir configuración de tutor"
              className="btn-nav"
              title="Configuración Tutor"
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          )}
        </div>
      </nav>

      <TarjetaPinTutor
        isOpen={mostrarPin}
        onClose={() => setMostrarPin(false)}
        onSuccess={handlePinValido}
      />
    </>
  );
}

export default Navbar;