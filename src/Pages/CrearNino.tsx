import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import TarjetaImagenAvatar from '../Components/TarjetaImagenAvatar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import AvatarDefault from '../assets/panda.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { createInfant, updateInfant, getInfants } from '../services/infantsService';
import type { ActualizarInfanteInput, CrearInfanteInput } from '../types/perfil';

function CrearNino() {
  const { id } = useParams<{ id?: string }>();
  const esEdicion = Boolean(id);

  const { tutorAutenticado, tutorOrigen, cargarNinos, ninos } = useNino();
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [mostrarTarjetaAvatar, setMostrarTarjetaAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!esEdicion || !id) return;

    async function precargarDatosInfante() {
      try {
        setLoading(true);
        let infanteActual = ninos.find((n) => n.id === id);

        if (!infanteActual && userId && token) {
          const lista = await getInfants(userId, token);
          infanteActual = lista.find((n) => n.id === id);
        }

        if (infanteActual) {
          setNombre(infanteActual.firstName || '');
          setApellido(infanteActual.lastName || '');
          setFechaNacimiento(infanteActual.birthDate ? infanteActual.birthDate.split('T')[0] : '');
          setPreviewUrl(infanteActual.avatarUrl || null);
        } else {
          setError('No se encontró el perfil del infante.');
        }
      } catch (err) {
        console.error('Error al precargar infante:', err);
        setError('Error al cargar la información del infante.');
      } finally {
        setLoading(false);
      }
    }

    precargarDatosInfante();
  }, [esEdicion, id, ninos, userId, token]);

  const handleAvatarSeleccionado = (urlNueva: string, archivoNuevo: File | null) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setArchivo(archivoNuevo);
    setPreviewUrl(urlNueva);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!userId || !token) {
      navigate('/', { replace: true });
      return;
    }

    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento) {
      setError('Todos los campos de texto son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      if (esEdicion && id) {
        const datosActualizar: ActualizarInfanteInput = {
          firstName: nombre.trim(),
          lastName: apellido.trim(),
          birthDate: fechaNacimiento,
          file: archivo || undefined,
        };
        await updateInfant(id, datosActualizar, token);
      } else {
        const datosCrear: CrearInfanteInput = {
          firstName: nombre.trim(),
          lastName: apellido.trim(),
          birthDate: fechaNacimiento,
          userId: userId,
          avatarUrl: previewUrl && !previewUrl.startsWith('blob:') ? previewUrl : '/src/assets/panda.png',
          file: archivo || undefined,
        };
        await createInfant(datosCrear, token);
      }

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      await cargarNinos(userId);
      navigate('/accesotutor');
    } catch (err) {
      console.error('Error al guardar el infante:', err);
      setError(err instanceof Error ? err.message : 'No se pudo guardar el perfil.');
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
              {esEdicion ? 'Editar Perfil de Infante' : 'Nuevo Perfil de Infante'}
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-6 text-center">
              {esEdicion ? 'Modifica los datos del infante' : 'Ingresa los datos del niño para crear su perfil'}
            </p>

            {error && (
              <div className="mensaje-error mb-4">
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
                  className="w-20 h-20 rounded-full bg-[#E0F7FA] border-4 border-dashed border-[#1B3A5C] flex items-center justify-center text-2xl text-[#1B3A5C] hover:bg-[#B2EBF2] transition-colors shadow-md group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Previsualización de avatar"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = AvatarDefault;
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
                className="btn-logear-teayudo mt-2 py-3.5 cursor-pointer"
              >
                {loading ? 'GUARDANDO...' : esEdicion ? 'ACTUALIZAR PERFIL' : 'CREAR PERFIL'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate('/accesotutor')}
                className="link-registro cursor-pointer"
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
        onSeleccionar={handleAvatarSeleccionado}
      />
    </Fondo>
  );
}

export default CrearNino;