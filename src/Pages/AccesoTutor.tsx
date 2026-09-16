import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/Navbar';
import TarjetaPinTutor from '../Components/TarjetaPinTutor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faPlus,
  faUserGroup,
  faPen,
  faTrashCan,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Fondo from '../Components/Fondo';
import Avatar from '../assets/panda.png';
import type { Infante } from '../types/perfil';

const calcularEdad = (fecha: string) => {
  if (!fecha) return '';
  const hoy = new Date();
  const nacimiento = new Date(fecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return `${edad} ${edad === 1 ? 'año' : 'años'}`;
};

function AccesoTutor() {
  const navigate = useNavigate();
  
  const { userId, token } = useAuth();
  const {
    ninos,
    loadingNinos,
    cargarNinos,
    setNinoActivo,
    setTutorAutenticado,
    setTutorOrigen,
  } = useNino();

  const [mostrarPin, setMostrarPin] = useState(false);
  const [modoGestion, setModoGestion] = useState(false);
  const [accionPendientePin, setAccionPendientePin] = useState<'gestion' | 'panel' | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      console.warn('No hay sesión activa. Redirigiendo a login...');
      navigate('/', { replace: true });
      return;
    }

    void cargarNinos(userId);
  }, [userId, token, cargarNinos, navigate]);

  const handleSeleccionarNino = (nino: Infante) => {
    if (modoGestion) return;
    setNinoActivo(nino);
    navigate('/menumodulos');
  };

  const solicitarPin = (accion: 'gestion' | 'panel') => {
    setAccionPendientePin(accion);
    setMostrarPin(true);
  };

  const handlePinValido = () => {
    setMostrarPin(false);
    if (accionPendientePin === 'gestion') {
      setModoGestion(true);
    } else {
      setTutorAutenticado(true);
      setTutorOrigen('global');
      navigate('/paneltutor');
    }
    setAccionPendientePin(null);
  };

  const handleEditarNino = (e: MouseEvent<HTMLButtonElement>, nino: Infante) => {
    e.stopPropagation();
    setNinoActivo(nino);
    navigate(`/editarnino/${nino.id}`);
  };

  const handleEliminarNino = async (e: MouseEvent<HTMLButtonElement>, nino: Infante) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar el perfil de ${nino.firstName}?`)) {
      try {
        console.log('Eliminando niño ID:', nino.id);
        if (userId) await cargarNinos(userId);
      } catch (err) {
        console.error('Error al eliminar perfil:', err);
      }
    }
  };

  const obtenerImagenAvatar = (avatarUrl: Infante['avatarUrl']) => {
    if (avatarUrl && avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    return Avatar;
  };

  return (
    <Fondo>
      <div className="min-h-screen flex flex-col">
        <Navbar rol="selector" />

        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-12 w-full">
          <h1 className="titulo-pagina md:text-4xl mb-2 text-center">
            {modoGestion ? 'Gestión de Perfiles' : '¿Quién está jugando hoy?'}
          </h1>
          <p className="text-[#4A7A96] mb-10 text-center text-base">
            {modoGestion
              ? 'Edita o elimina los perfiles asociados a tu cuenta'
              : 'Selecciona para entrar al perfil del niño o accede como tutor'}
          </p>

          <div className="w-full overflow-x-auto py-6 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="flex gap-6 items-center min-w-full w-max justify-center mx-auto px-2">
              {loadingNinos ? (
                <div className="flex items-center justify-center py-10 w-full">
                  <p className="text-[#4A7A96] font-bold animate-pulse">Cargando perfiles...</p>
                </div>
              ) : (
                <>
                  {ninos.map((nino) => (
                    <div
                      key={nino.id}
                      onClick={() => handleSeleccionarNino(nino)}
                      className={`tarjeta-perfil ${
                        modoGestion ? 'cursor-default hover:scale-100' : 'cursor-pointer'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-full bg-[#E0F7FA] border-4 border-[#1B3A5C] flex items-center justify-center overflow-hidden shrink-0">
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

                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#1B3A5C] text-md truncate max-w-32.5 text-center">
                          {nino.firstName}
                        </span>
                        <span className="font-extrabold text-[#1B3A5C] text-md truncate max-w-32.5 text-center">
                          {nino.lastName}
                        </span>
                      </div>

                      {modoGestion ? (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={(e) => handleEditarNino(e, nino)}
                            aria-label={`Editar ${nino.firstName}`}
                            className="w-9 h-9 rounded-xl bg-[#E0F7FA] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white transition-colors flex items-center justify-center text-sm shadow-sm active:scale-95"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => void handleEliminarNino(e, nino)}
                            aria-label={`Eliminar ${nino.firstName}`}
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center text-sm shadow-sm active:scale-95"
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-[#78909C] font-semibold">
                          {calcularEdad(nino.birthDate)}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => navigate('/crearnino')}
                    className="tarjeta-perfil border-2 border-dashed border-[#1B3A5C]/30 hover:border-[#1B3A5C]"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#F0F4F8] border-4 border-dashed border-[#1B3A5C] flex items-center justify-center text-3xl text-[#1B3A5C] shrink-0">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#1B3A5C] text-md">
                        Agregar
                      </span>
                      <span className="font-extrabold text-[#1B3A5C] text-md">
                        Niño
                      </span>
                    </div>
                    <p className="text-sm text-[#78909C] font-semibold">
                      Nuevo perfil
                    </p>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {!modoGestion ? (
              <>
                <button
                  type="button"
                  onClick={() => solicitarPin('panel')}
                  aria-label="Acceso de tutor"
                  className="bg-blue-300 flex items-center gap-2 hover:bg-[#2A4F73] hover:text-white px-6 py-3 rounded-full transition-colors shadow-md text-[#1B3A5C] font-bold"
                >
                  <FontAwesomeIcon icon={faGear} />
                  <span>Acceso de tutor</span>
                </button>

                <button
                  type="button"
                  onClick={() => solicitarPin('gestion')}
                  aria-label="Editar perfiles"
                  className="bg-blue-300 flex items-center gap-2 hover:bg-[#2A4F73] hover:text-white px-6 py-3 rounded-full transition-colors shadow-md text-[#1B3A5C] font-bold"
                >
                  <FontAwesomeIcon icon={faUserGroup} />
                  <span>Gestionar perfiles</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setModoGestion(false)}
                aria-label="Volver a la selección normal"
                className="bg-[#1B3A5C] text-white flex items-center gap-2 hover:bg-[#2A4F73] px-6 py-3 rounded-full transition-colors shadow-md font-bold"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Listo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <TarjetaPinTutor
        isOpen={mostrarPin}
        onClose={() => {
          setMostrarPin(false);
          setAccionPendientePin(null);
        }}
        onSuccess={handlePinValido}
      />
    </Fondo>
  );
}

export default AccesoTutor;