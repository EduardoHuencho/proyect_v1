import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import TarjetaImagenAvatar from '../Components/TarjetaImagenAvatar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../assets/panda.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { createInfant } from '../services/infantsService';
import type { CrearInfanteInput } from '../types/perfil';

function CrearNino() {
  const { tutorAutenticado, tutorOrigen, cargarNinos } = useNino();
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const [mostrarTarjetaAvatar, setMostrarTarjetaAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!userId || !token) {
      navigate('/', { replace: true });
      return;
    }

    setLoading(true);

    try {
      const cuerpo: CrearInfanteInput = {
        firstName: nombre.trim(),
        lastName: apellido.trim(),
        birthDate: fechaNacimiento,
        userId: userId,
        avatarUrl: avatar || Avatar,
      };

      await createInfant(cuerpo, token);

      await cargarNinos(userId);
      navigate('/accesotutor');
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'CREATION_ERROR') {
        setError('No se pudo guardar el perfil.');
      } else {
        setError('Error de conexión con el servidor.');
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMostrarTarjetaAvatar(true)}
                  aria-label="Seleccionar avatar"
                  className="w-20 h-20 rounded-full bg-[#E0F7FA] border-4 border-dashed border-[#1B3A5C] flex items-center justify-center text-2xl text-[#1B3A5C] hover:bg-[#B2EBF2] transition-colors shadow-md group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Previsualización de avatar"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = Avatar;
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCamera}
                      className="group-hover:scale-110 transition-transform"
                    />
                  )}
                </button>
              </div>

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
                {loading ? 'GUARDANDO...' : 'CREAR PERFIL'}
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

      <TarjetaImagenAvatar
        isOpen={mostrarTarjetaAvatar}
        onClose={() => setMostrarTarjetaAvatar(false)}
        onSeleccionar={(urlImagen: string) => setAvatar(urlImagen)}
      />
    </Fondo>
  );
}

export default CrearNino;