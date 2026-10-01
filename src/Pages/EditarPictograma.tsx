import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import TarjetaImagenPictograma from '../Components/TarjetaImagenPictograma';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { usePictogramas } from '../context/PictogramasContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faImage } from '@fortawesome/free-solid-svg-icons';
import { updatePictogram, updatePictogramImage } from '../services/pictogramsService';

interface Feedback {
  type: 'error' | 'success';
  message: string;
}

function EditarPictograma() {
  const navigate = useNavigate();
  const { id: pictogramId } = useParams<{ id: string }>();
  const { tutorAutenticado, ninoActivo } = useNino();
  const { token } = useAuth();
  const { pictogramas, cargarPictogramas } = usePictogramas();

  // Buscar el pictograma en el contexto
  const pictogramaActual = pictogramas.find((p) => p.id === pictogramId);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esPersonal, setEsPersonal] = useState(false);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [modalImagenAbierto, setModalImagenAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Pre-cargar los datos del pictograma cuando esté disponible
  useEffect(() => {
    if (pictogramaActual) {
      setNombre(pictogramaActual.pictogramName);
      setDescripcion(pictogramaActual.description || '');
      setEsPersonal(pictogramaActual.personal);
      setPreviewUrl(pictogramaActual.pictoImageUrl);
    }
  }, [pictogramaActual?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImagenSeleccionada = (archivoNuevo: File, urlNueva: string) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setArchivo(archivoNuevo);
    setPreviewUrl(urlNueva);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!token || !pictogramId) {
      navigate('/', { replace: true });
      return;
    }

    if (!nombre.trim()) {
      setFeedback({ type: 'error', message: 'El nombre del pictograma es obligatorio.' });
      return;
    }

    setLoading(true);

    try {
      // 1. Actualizar campos de texto.
      // Cuando el pictograma es privado, incluir el infantId del infante seleccionado
      // en la lista del navbar (ninoActivo). Requiere que el backend tenga habilitado
      // el campo infantId en UpdatePictogramDto.
      await updatePictogram(
        pictogramId,
        {
          pictogramName: nombre.trim(),
          description: descripcion.trim(),
          personal: esPersonal,
          ...(esPersonal && ninoActivo?.id ? { infantId: ninoActivo.id } : {}),
        },
        token
      );

      // 2. Si se seleccionó una nueva imagen, actualizarla por separado
      if (archivo) {
        await updatePictogramImage(pictogramId, archivo, token);
      }

      // Recargar la lista de pictogramas en el contexto
      await cargarPictogramas();

      setFeedback({ type: 'success', message: 'Pictograma actualizado correctamente.' });

      setTimeout(() => navigate('/pictogramas'), 1200);
    } catch (err) {
      console.error('Error al actualizar pictograma:', err);
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'No se pudo actualizar el pictograma.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pictogramaActual) {
    return (
      <Fondo>
        <div className="flex flex-col min-h-screen">
          <Navbar
            rol={tutorAutenticado ? 'tutor' : 'nino'}
            esPictogramas={false}
            rutaVolver="/pictogramas"
            labelVolver="Volver"
            pinSoloDesbloquea={true}
          />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#005088] font-semibold text-sm">
              Pictograma no encontrado.
            </p>
          </div>
        </div>
      </Fondo>
    );
  }

  return (
    <Fondo>
      <div className="flex flex-col min-h-screen">
        <Navbar
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={false}
          rutaVolver="/pictogramas"
          labelVolver="Volver"
          pinSoloDesbloquea={true}
        />

        <div className="flex-1 flex items-center justify-center px-6 py-8 w-full">
          <div className="tarjeta-auth max-w-md w-full p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1 text-center">
              Editar Pictograma
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-4 text-center">
              Modifica los datos del pictograma.
            </p>

            {feedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-bold ${
                  feedback.type === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Imagen */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalImagenAbierto(true)}
                  className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#1A7A6E] bg-[#E0F7FA]/30 hover:bg-[#E0F7FA]/60 flex flex-col items-center justify-center text-[#1A7A6E] transition-colors overflow-hidden cursor-pointer shadow-inner"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/150x150?text=imagen';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                      <FontAwesomeIcon icon={faImage} className="text-3xl opacity-70" />
                      <span className="text-[11px] font-bold leading-tight">Sin imagen</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setModalImagenAbierto(true)}
                  className="text-xs font-semibold text-[#1A7A6E] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                  <span>{archivo ? 'Cambiar imagen' : 'Reemplazar imagen'}</span>
                </button>

                {archivo && (
                  <span className="text-[10px] text-[#1A7A6E] font-bold bg-[#E0F7FA] rounded-full px-2 py-0.5">
                    ✓ Nueva imagen seleccionada
                  </span>
                )}
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label htmlFor="pictogramName" className="text-xs font-bold text-[#005088] px-1">
                  NOMBRE DEL PICTOGRAMA
                </label>
                <input
                  id="pictogramName"
                  type="text"
                  required
                  disabled={loading}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Comer manzana"
                  className="input-teayudo"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-xs font-bold text-[#005088] px-1">
                  DESCRIPCIÓN
                </label>
                <textarea
                  id="description"
                  rows={3}
                  disabled={loading}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles sobre el uso del pictograma..."
                  className="input-teayudo resize-none py-2"
                />
              </div>

              {/* Visibilidad */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#005088] px-1">
                  VISIBILIDAD DEL PICTOGRAMA
                </label>
                <div className="w-full bg-[#B0C8DC]/70 border-2 border-[#7A9AB8] rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-[#003052]">
                      {esPersonal ? 'Privado' : 'Público'}
                    </span>
                    <span className="text-[11px] font-medium text-[#003052]/70">
                      {esPersonal ? 'Solo visible para el infante' : 'Visible de forma general'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={esPersonal}
                      onChange={(e) => setEsPersonal(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#7A9AB8]/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B3A5C]"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !nombre.trim()}
                className="btn-logear-teayudo mt-2 py-3.5 cursor-pointer"
              >
                {loading ? 'Guardando cambios...' : 'GUARDAR CAMBIOS'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate('/pictogramas')}
                className="link-registro cursor-pointer"
              >
                Cancelar y volver
              </button>
            </div>
          </div>
        </div>
      </div>

      <TarjetaImagenPictograma
        isOpen={modalImagenAbierto}
        onClose={() => setModalImagenAbierto(false)}
        onSeleccionar={handleImagenSeleccionada}
      />
    </Fondo>
  );
}

export default EditarPictograma;
