import { useState } from 'react';
import { useNavigate } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';

function CrearNino() {
  const { tutorAutenticado, tutorOrigen } = useNino();
  const { userId } = useAuth();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCrearNino(e) {
    // funcion que evita la recarga y por ende la limpieza del formulario
    e.preventDefault();
    setError(null);

    const idPadre = localStorage.getItem('userId') || userId;
    
    //if (!idPadre) {
    //  setError('No se detectó la sesión del tutor. Por favor, inicia sesión nuevamente.');
    //  return;
    //}

    if (!idPadre) {
      console.warn('No hay sesión de tutor activa. Redirigiendo a login...');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      const nuevoInfante = {
        firstName: nombre.trim(),
        lastName: apellido.trim(),
        birthDate: fechaNacimiento,
        userId: idPadre,
        // cambiar por ruta real y no texto estatico
        avatarUrl: 'ruta',
      };

      console.log('Enviando nuevo infante con tutor ID:', idPadre);

      const response = await fetch('http://localhost:3000/infant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoInfante),
      });

      if (!response.ok) {
        throw new Error('CREATION_ERROR');
      }

      const data = await response.json();
      console.log('Infante creado exitosamente:', data);

      navigate('/accesotutor');
    } catch (err) {
      console.error('Error al registrar infante:', err);
      if (err.message === 'CREATION_ERROR') {
        setError('No se pudo registrar el perfil.');
      } else {
        setError('Error de conexión con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen">
        <Navbar
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={false}
          rutaVolver={
            tutorAutenticado
              ? tutorOrigen === 'global'
                ? '/dashboardtutor'
                : '/accesotutor'
              : '/accesotutor'
          }
          labelVolver="Volver"
          pinSoloDesbloquea={true}
        />

        <div className="flex-1 flex items-center justify-center px-6 py-8 w-full">
          <div className="tarjeta-auth max-w-md p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1 text-center">
              Nuevo Perfil de Infante
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-6 text-center">
              Ingresa los datos del niño para crear su perfil
            </p>

            {error && (
              <div className="mensaje-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCrearNino} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="nombre-nino" className="sr-only">Nombre</label>
                  <input
                    id="nombre-nino"
                    type="text"
                    required
                    disabled={loading}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    className="input-teayudo"
                  />
                </div>
                <div>
                  <label htmlFor="apellido-nino" className="sr-only">Apellido</label>
                  <input
                    id="apellido-nino"
                    type="text"
                    required
                    disabled={loading}
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                    className="input-teayudo"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="fecha-nacimiento" className="text-xs font-bold text-[#005088] px-1">
                  FECHA DE NACIMIENTO
                </label>
                <input
                  id="fecha-nacimiento"
                  type="date"
                  required
                  disabled={loading}
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="input-teayudo cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-logear-teayudo mt-2 py-3.5"
              >
                {loading ? 'CREANDO...' : 'CREAR PERFIL'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate('/accesotutor')}
                className="link-registro"
              >
                Cancelar y volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fondo>
  );
}

export default CrearNino;