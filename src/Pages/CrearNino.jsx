import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import TarjetaImagenAvatar from '../Components/TarjetaImagenAvatar';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../assets/panda.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function CrearNino() {
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const { tutorAutenticado, tutorOrigen, ninos, cargarNinos, ninoActivo } = useNino();
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const ninoAEditar = esEdicion
    ? (ninoActivo && String(ninoActivo.id) === String(id))
      ? ninoActivo
      : ninos.find((n) => String(n.id) === String(id))
    : null;

  const [nombre, setNombre] = useState(() => ninoAEditar?.firstName || '');
  const [apellido, setApellido] = useState(() => ninoAEditar?.lastName || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(() => ninoAEditar?.birthDate || '');
  
  // previsualizacion local de la foto cargada
  const [avatar, setAvatar] = useState(() => {
    const url = ninoAEditar?.avatarUrl;
    if (url && url.startsWith('blob:')) return null;
    return url || null;
  });

  const [mostrarTarjetaAvatar, setMostrarTarjetaAvatar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const idPadre = localStorage.getItem('userId') || userId;
    if (!idPadre) {
      navigate('/');
      return;
    }

    if (esEdicion) {
      console.log('Edicion simulada del infante:', id);
      navigate('/accesotutor');
      return;
    }

    setLoading(true);

    try {
      const cuerpo = {
        firstName: nombre.trim(),
        lastName: apellido.trim(),
        birthDate: fechaNacimiento,
        userId: idPadre,
        // asset local a la bd
        avatarUrl: Avatar,
      };

      const response = await fetch('http://localhost:3000/infant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cuerpo),
      });

      if (!response.ok) {
        throw new Error('CREATION_ERROR');
      }

      await cargarNinos(idPadre);
      navigate('/accesotutor');
    } catch (err) {
      console.error(err);
      if (err.message === 'CREATION_ERROR') {
        setError('No se pudo crear el perfil.');
      } else {
        setError('Error de conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleEliminar() {
    console.log('Eliminacion simulada del infante:', id);
    setMostrarModalEliminar(false);
    navigate('/accesotutor');
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
              {esEdicion
                ? 'Modifica los datos del niño'
                : 'Ingresa los datos del niño para crear su perfil'}
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
                {loading
                  ? 'GUARDANDO...'
                  : esEdicion
                  ? 'ACTUALIZAR PERFIL'
                  : 'CREAR PERFIL'}
              </button>

              {esEdicion && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMostrarModalEliminar(true)}
                  className="btn-eliminar-teayudo"
                >
                  <span>Eliminar perfil</span>
                </button>
              )}
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
        onSeleccionar={(urlImagen) => setAvatar(urlImagen)}
      />

      {mostrarModalEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="tarjeta-auth max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold text-[#1B3A5C] mb-2">¿Eliminar perfil?</h3>
            <p className="text-sm text-[#78909C] mb-6">
              Esta acción no se puede deshacer. Se borrarán los datos de {nombre}.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleEliminar}
                className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                type="button"
                onClick={() => setMostrarModalEliminar(false)}
                className="flex-1 py-2.5 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Fondo>
  );
}

export default CrearNino;