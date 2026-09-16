import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import TarjetaImagenPictograma from '../Components/TarjetaImagenPictograma';
import { usePictogramas } from '../context/PictogramasContext';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faChild, faImage } from '@fortawesome/free-solid-svg-icons';
import { getCategories } from '../services/pictogramsService';
import type { Categoria } from '../types/pictograma';

interface Feedback {
  type: 'error';
  message: string;
}

function CrearPictograma() {
  const navigate = useNavigate();
  const { crearPictograma } = usePictogramas();
  const { tutorAutenticado, ninoActivo } = useNino();
  const { userId, token } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [modalImagenAbierto, setModalImagenAbierto] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const lista = await getCategories(token);
        setCategorias(lista);
        if (lista.length > 0) {
          setCategoryId(lista[0].id);
        }
      } catch (err) {
        console.error('Error fetching categorias:', err);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [token]);

  const handleImagenSeleccionada = (archivoNuevo: File, urlNueva: string) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setArchivo(archivoNuevo);
    setPreviewUrl(urlNueva);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!userId || !token) {
      navigate('/', { replace: true });
      return;
    }

    if (!ninoActivo?.id) {
      setFeedback({
        type: 'error',
        message: 'Debes tener un infante seleccionado para registrar el pictograma.',
      });
      return;
    }

    if (!nombre.trim()) {
      setFeedback({
        type: 'error',
        message: 'El nombre del pictograma es obligatorio.',
      });
      return;
    }

    if (!categoryId) {
      setFeedback({
        type: 'error',
        message: 'Debes seleccionar una categoría.',
      });
      return;
    }

    if (!archivo) {
      setFeedback({
        type: 'error',
        message: 'Debes seleccionar una imagen para el pictograma.',
      });
      return;
    }

    setLoading(true);

    try {
      await crearPictograma({
        pictogramName: nombre.trim(),
        description: descripcion.trim(),
        categoryId: categoryId,
        file: archivo,
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      navigate('/pictogramas');
    } catch (err) {
      console.error('Error al registrar pictograma:', err);
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'No se pudo registrar el pictograma.',
      });
    } finally {
      setLoading(false);
    }
  };

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
              Nuevo Pictograma
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-4 text-center">
              Creación de nuevo pictograma.
            </p>

            {ninoActivo && (
              <div className="flex items-center justify-center gap-2 mb-5 px-3 py-1.5 bg-[#E0F7FA] border border-[#B2EBF2] rounded-xl text-xs font-bold text-[#005088]">
                <FontAwesomeIcon icon={faChild} />
                <span>
                  Asignado a: {ninoActivo.firstName} {ninoActivo.lastName || ''}
                </span>
              </div>
            )}

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
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalImagenAbierto(true)}
                  className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#1A7A6E] bg-[#E0F7FA]/30 hover:bg-[#E0F7FA]/60 flex flex-col items-center justify-center text-[#1A7A6E] transition-colors overflow-hidden group cursor-pointer shadow-inner"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                      <FontAwesomeIcon icon={faImage} className="text-3xl opacity-70" />
                      <span className="text-[11px] font-bold leading-tight">
                        Subir imagen
                      </span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setModalImagenAbierto(true)}
                  className="text-xs font-semibold text-[#1A7A6E] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                  <span>{archivo ? 'Cambiar imagen' : 'Seleccionar imagen'}</span>
                </button>
              </div>

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

              <div className="flex flex-col gap-1">
                <label htmlFor="categoryId" className="text-xs font-bold text-[#005088] px-1">
                  CATEGORÍA
                </label>
                <select
                  id="categoryId"
                  required
                  disabled={loading || loadingCategorias}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-teayudo cursor-pointer"
                >
                  {loadingCategorias ? (
                    <option value="">Cargando categorías...</option>
                  ) : categorias.length === 0 ? (
                    <option value="">No hay categorías disponibles</option>
                  ) : (
                    categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !ninoActivo || loadingCategorias || !categoryId}
                className="btn-logear-teayudo mt-2 py-3.5 cursor-pointer"
              >
                {loading ? 'SUBIENDO A S3...' : 'CREAR PICTOGRAMA'}
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

export default CrearPictograma;