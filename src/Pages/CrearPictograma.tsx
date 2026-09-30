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
import { faCloudArrowUp, faImage, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getCategories } from '../services/pictogramsService';
import type { Categoria } from '../types/pictograma';

interface Feedback {
  type: 'error';
  message: string;
}

function CrearPictograma() {
  const navigate = useNavigate();
  const { crearPictograma } = usePictogramas();
  const { tutorAutenticado, ninos, cargarNinos } = useNino();
  const { userId, token } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [modalImagenAbierto, setModalImagenAbierto] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const [infantesSeleccionados, setInfantesSeleccionados] = useState<string[]>([]);
  const [dropdownInfantesAbierto, setDropdownInfantesAbierto] = useState(false);
  const [esPersonal, setEsPersonal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (userId) {
      cargarNinos(userId);
    }
  }, [userId, cargarNinos]);

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

  const toggleInfante = (id: string) => {
    setInfantesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!userId || !token) {
      navigate('/', { replace: true });
      return;
    }

    if (infantesSeleccionados.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Debes seleccionar al menos un infante para asociar el pictograma.',
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
      for (const infantId of infantesSeleccionados) {
        await crearPictograma({
          pictogramName: nombre.trim(),
          description: descripcion.trim(),
          categoryId: categoryId,
          personal: esPersonal,
          file: archivo,
          infantId: infantId,
        });
      }

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

              <div className="flex flex-col gap-1 relative">
                <label className="text-xs font-bold text-[#005088] px-1">
                  ASIGNAR A INFANTES
                </label>
                <button
                  type="button"
                  onClick={() => setDropdownInfantesAbierto(!dropdownInfantesAbierto)}
                  className="input-teayudo flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="truncate">
                    {infantesSeleccionados.length === 0
                      ? 'Seleccionar infantes...'
                      : `${infantesSeleccionados.length} infante(s) seleccionado(s)`}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-2 text-[#003052]/70" />
                </button>

                {dropdownInfantesAbierto && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] shadow-xl z-20 p-3 flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {ninos.length === 0 ? (
                      <p className="text-xs text-[#003052] font-medium text-center py-2">No hay infantes registrados</p>
                    ) : (
                      ninos.map((nino) => {
                        const seleccionado = infantesSeleccionados.includes(nino.id);
                        return (
                          <label
                            key={nino.id}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-white/40 rounded-xl cursor-pointer text-xs font-bold text-[#003052]"
                          >
                            <input
                              type="checkbox"
                              checked={seleccionado}
                              onChange={() => toggleInfante(nino.id)}
                              className="w-4 h-4 rounded text-[#1B3A5C] focus:ring-0 cursor-pointer"
                            />
                            <span>{nino.firstName} {nino.lastName || ''}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

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
                disabled={loading || infantesSeleccionados.length === 0 || loadingCategorias || !categoryId}
                className="btn-logear-teayudo mt-2 py-3.5 cursor-pointer"
              >
                {loading ? 'Creando Pictograma...' : 'CREAR PICTOGRAMA'}
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