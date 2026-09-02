import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Fondo from '../Components/Fondo';
import Navbar from '../Components/Navbar';
import { usePictogramas } from '../context/PictogramasContext';
import { useNino } from '../context/NinoContext';
import { useAuth } from '../context/AuthContext';
import AvatarDefault from '../assets/panda.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faChild } from '@fortawesome/free-solid-svg-icons';

function CrearPictograma() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { crearPictograma } = usePictogramas();
  const { tutorAutenticado, ninoActivo } = useNino();
  const { userId, token } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(AvatarDefault);

  const [categorias, setCategorias] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const response = await fetch('http://localhost:3000/category', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) throw new Error('Error al cargar categorías');

        const data = await response.json();
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setCategorias(lista);
        if (lista.length > 0) {
          setCategoryId(String(lista[0].id));
        }
      } catch (err) {
        console.error('Error fetching categorias:', err);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, [token]);

  const handleFileChange = (e) => {
    const fileSelected = e.target.files?.[0];
    if (fileSelected) {
      if (previewUrl && previewUrl !== AvatarDefault) {
        URL.revokeObjectURL(previewUrl);
      }
      setArchivo(fileSelected);
      setPreviewUrl(URL.createObjectURL(fileSelected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const idPadre = localStorage.getItem('userId') || userId;
    if (!idPadre) {
      navigate('/');
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

    setLoading(true);

    try {
      let archivoAEnviar = archivo;

      if (!archivoAEnviar) {
        const resImagen = await fetch(AvatarDefault);
        const blobImagen = await resImagen.blob();
        archivoAEnviar = new File([blobImagen], 'default-pictogram.png', {
          type: blobImagen.type || 'image/png',
        });
      }

      await crearPictograma({
        pictogramName: nombre.trim(),
        description: descripcion.trim(),
        categoryId: categoryId,
        file: archivoAEnviar,
      });

      if (previewUrl && previewUrl !== AvatarDefault) {
        URL.revokeObjectURL(previewUrl);
      }

      navigate('/pictogramas');
    } catch (err) {
      console.error('Error al registrar pictograma:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'No se pudo registrar el pictograma.',
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
              Subida a S3 y persistencia en base de datos
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
              {/* Imagen / Preview */}
              <div className="flex flex-col items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#1A7A6E] bg-[#E0F7FA]/30 flex flex-col items-center justify-center text-[#1A7A6E] hover:bg-[#E0F7FA]/60 transition-colors overflow-hidden group cursor-pointer"
                >
                  <img
                    src={previewUrl}
                    alt="Previsualización"
                    className="w-full h-full object-contain p-2"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
    </Fondo>
  );
}

export default CrearPictograma;