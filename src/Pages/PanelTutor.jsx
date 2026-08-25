import { useNavigate } from 'react-router';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Fondo from '../Components/Fondo';

function PanelTutor() {
  const navigate = useNavigate();
  const { setTutorAutenticado, setTutorOrigen } = useNino();
  const { logout } = useAuth();

  const handleCerrarSesion = () => {
    setTutorAutenticado(false);
    setTutorOrigen(null);
    logout();
    navigate('/');
  };

  return (
    <Fondo>
      <Navbar rol="tutor" />

      <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center">
        <h1 className="titulo-pagina mb-2 text-center">
          Panel de Tutor
        </h1>
        <p className="text-[#4A7A96] mb-12 text-center">¿Qué deseas hacer?</p>

        <div className="w-full flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboardtutor')}
            className="btn-panel-accion bg-[#1A7A6E] hover:bg-[#15695F] text-white shadow-md"
          >
            <div className="icono-panel-accion bg-white/20">
              <FontAwesomeIcon icon={faGrip} />
            </div>
            <div>
              <p className="font-extrabold text-lg">Ir al Dashboard Tutor</p>
              <p className="text-sm text-white/70">
                Ingreso al menú principal de módulos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCerrarSesion}
            className="btn-panel-accion bg-white hover:bg-red-50 border-2 border-[#E53935] shadow-sm"
          >
            <div className="icono-panel-accion bg-red-50 text-[#E53935]">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div>
              <p className="font-extrabold text-lg text-[#E53935]">
                Cerrar Sesión de Perfil
              </p>
              <p className="text-sm text-red-400">
                Cerrar cuenta y volver al login
              </p>
            </div>
          </button>
        </div>
      </div>
    </Fondo>
  );
}

export default PanelTutor;