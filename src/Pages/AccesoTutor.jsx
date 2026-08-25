import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/Navbar';
import TarjetaPinTutor from '../Components/TarjetaPinTutor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';
import Fondo from '../Components/Fondo';

const calcularEdad = (fecha) => {
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
  const { setNinoActivo, setTutorAutenticado, setTutorOrigen } = useNino();
  const { userId } = useAuth();

  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarPin, setMostrarPin] = useState(false);

  useEffect(() => {
    // Verificacion de sesion
    const idPadre = localStorage.getItem('userId') || userId;

    // si no existe un tutor logueado o un id en el localStorage se vuelve al login
    if (!idPadre) {
      console.warn('No hay sesión de tutor activa. Redirigiendo a login...');
      navigate('/');
      return;
    }

    async function cargarNinos() {
      try {
        setLoading(true);
        console.log('Consultando infantes vinculados al tutor ID:', idPadre);
        const response = await fetch(`http://localhost:3000/infant/user/${idPadre}`);

        if (!response.ok) {
          throw new Error('FETCH_ERROR');
        }

        const data = await response.json();
        console.log('Infantes recibidos de la base de datos:', data);
        setNinos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener la lista de infantes:', err);
      } finally {
        setLoading(false);
      }
    }

    cargarNinos();
  }, [userId, navigate]);

  const handleSeleccionarNino = (nino) => {
    setNinoActivo(nino);
    navigate('/menumodulos');
  };

  const handlePinValido = () => {
    setMostrarPin(false);
    setTutorAutenticado(true);
    setTutorOrigen('global');
    navigate('/paneltutor');
  };

  return (
    <Fondo>
      <div className="min-h-screen flex flex-col">
        <Navbar rol="selector" />

        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-12 w-full">
          <h1 className="titulo-pagina md:text-4xl mb-2 text-center">
            ¿Quién está jugando hoy?
          </h1>
          <p className="text-[#4A7A96] mb-10 text-center text-base">
            Selecciona para entrar al perfil del niño o accede como tutor
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-4 py-4 justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-[#4A7A96] font-bold animate-pulse">Cargando perfiles...</p>
              </div>
            ) : (
              <>
                {ninos.map((nino) => (
                  <button
                    type="button"
                    key={nino.id}
                    onClick={() => handleSeleccionarNino(nino)}
                    className="tarjeta-perfil"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#E0F7FA] border-4 border-[#1B3A5C] flex items-center justify-center overflow-hidden">
                      {nino.avatarUrl?.startsWith('http') || nino.avatar_url?.startsWith('http') ? (
                        <img
                          src={nino.avatarUrl}
                          alt={nino.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (

                        // cambiar por url predeterminada en caso de no detectar la ruta
                        <span className="text-4xl">
                          {nino.avatarUrl || 'avatar'}
                        </span>
                      )}
                    </div>
                    <p className="font-extrabold text-[#1B3A5C] text-lg truncate max-w-30">
                      {nino.firstName}
                    </p>
                    <p className="text-sm text-[#78909C] font-semibold">
                      {calcularEdad(nino.birthDate)}
                    </p>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => navigate('/crearnino')}
                  className="tarjeta-perfil border-2 border-dashed border-[#1B3A5C]/30 hover:border-[#1B3A5C]"
                >
                  <div className="w-20 h-20 rounded-full bg-[#F0F4F8] border-4 border-dashed border-[#1B3A5C] flex items-center justify-center text-3xl text-[#1B3A5C]">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <p className="font-extrabold text-[#1B3A5C] text-lg">
                    Agregar niño
                  </p>
                  <p className="text-sm text-[#78909C] font-semibold">
                    Nuevo perfil
                  </p>
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMostrarPin(true)}
            aria-label="Acceso de tutor"
            className="mt-6 bg-blue-300 flex items-center gap-2 hover:bg-[#2A4F73] hover:text-white px-6 py-3 rounded-full transition-colors shadow-md text-[#1B3A5C] font-bold"
          >
            <FontAwesomeIcon icon={faGear} />
            <span>Acceso de tutor</span>
          </button>
        </div>
      </div>

      <TarjetaPinTutor
        isOpen={mostrarPin}
        onClose={() => setMostrarPin(false)}
        onSuccess={handlePinValido}
      />
    </Fondo>
  );
}

export default AccesoTutor;