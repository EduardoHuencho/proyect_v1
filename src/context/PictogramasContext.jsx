import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  //useEffect,
} from 'react';
import { useAuth } from './AuthContext';
import { useNino } from './NinoContext';
import ImagenPictograma from '../assets/panda.png';

const PictogramaContext = createContext(null);

const normalizarPictograma = (item) => {
  if (!item) return null;

  //const urlS3 = item.pictoImageUrl || item.iconUrl || item.imageUrl || ImagenPictograma;
  const urlS3 = item.pictoImageUrl || ImagenPictograma;

  const catId = item.category?.id || item.categoryId || '';

  return {
    id: String(item.id || item._id || crypto.randomUUID()),
    label: item.pictogramName || item.label || 'Sin nombre',
    icon: urlS3,
    //pictoImageKey: item.pictoImageKey || null,
    categoryId: String(catId),
    //categoryName: item.category?.categoryName || '',
    //color: item.color || '#FFFFFF',
    description: item.description || '',
    userId: item.userId,
    infantId: item.infantId,
  };
};

export function PictogramaProvider({ children }) {
  const { userId, token } = useAuth();
  const { ninoActivo } = useNino();

  const [pictogramas, setPictogramas] = useState([]);
  const [loadingPictogramas, setLoadingPictogramas] = useState(false);
  const [errorPictogramas, setErrorPictogramas] = useState(null);

  // Recargar pictogramas desde el backend
  const cargarPictogramas = useCallback(
    async (idTutor = userId) => {
      const id = idTutor || localStorage.getItem('userId');
      if (!id) return;

      try {
        setLoadingPictogramas(true);
        setErrorPictogramas(null);

        const response = await fetch(`http://localhost:3000/pictogram`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`HTTP_ERROR_${response.status}`);
        }

        const resJson = await response.json();
        console.log('Pictogramas recibidos del backend:', resJson);

        let listaBackend = [];
        if (Array.isArray(resJson)) {
          listaBackend = resJson;
        } else if (Array.isArray(resJson.data)) {
          listaBackend = resJson.data;
        } else if (Array.isArray(resJson.pictograms)) {
          listaBackend = resJson.pictograms;
        }

        const procesados = listaBackend
          .map(normalizarPictograma)
          .filter(Boolean);

        setPictogramas(procesados);
      } catch (err) {
        console.error('Error al cargar pictogramas del tutor:', err);
        setErrorPictogramas('No se pudieron sincronizar los pictogramas personalizados');
        setPictogramas([]);
      } finally {
        setLoadingPictogramas(false);
      }
    },
    [userId, token]
  );

  // Carga inicial
  /*
  useEffect(() => {
    let ignorado = false;
    const id = userId || localStorage.getItem('userId');
    if (!id) return;

    const fetchInicial = async () => {
      try {
        setLoadingPictogramas(true);
        const response = await fetch(`http://localhost:3000/user/${id}/pictograms`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);

        const resJson = await response.json();
        if (ignorado) return;

        let listaBackend = [];
        if (Array.isArray(resJson)) listaBackend = resJson;
        else if (Array.isArray(resJson.data)) listaBackend = resJson.data;
        else if (Array.isArray(resJson.pictograms)) listaBackend = resJson.pictograms;

        setPictogramas(listaBackend.map(normalizarPictograma).filter(Boolean));
      } catch (err) {
        if (!ignorado) {
          console.error('Error al cargar pictogramas iniciales:', err);
          setPictogramas([]);
        }
      } finally {
        if (!ignorado) setLoadingPictogramas(false);
      }
    };

    fetchInicial();

    return () => {
      ignorado = true;
    };
  }, [userId, token]);
  */

  // Crear pictograma
  /*const crearPictograma = useCallback(
    async (datosPictograma) => {
      setErrorPictogramas(null);
      const idPadre = localStorage.getItem('userId') || userId;
      if (!idPadre) throw new Error('NO_TUTOR_SESSION');

      setLoadingPictogramas(true);

      try {
        let formData;
        if (datosPictograma instanceof FormData) {
          formData = datosPictograma;
        } else {
          formData = new FormData();
          formData.append(
            'pictogramName',
            datosPictograma.pictogramName || datosPictograma.label || ''
          );
          formData.append('description', datosPictograma.description || '');
          formData.append('categoryId', datosPictograma.categoryId || '');
          formData.append('userId', idPadre);

          if (ninoActivo?.id) formData.append('infantId', ninoActivo.id);
          if (datosPictograma.file) formData.append('file', datosPictograma.file);
        }

        if (!formData.has('userId')) formData.append('userId', idPadre);
        if (ninoActivo?.id && !formData.has('infantId')) formData.append('infantId', ninoActivo.id);

        const response = await fetch('http://localhost:3000/pictogram', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'CREATION_ERROR');

        await cargarPictogramas(idPadre);
        return data;
      } catch (err) {
        console.error('Error al subir pictograma:', err);
        throw err;
      } finally {
        setLoadingPictogramas(false);
      }
    },
    [userId, token, ninoActivo, cargarPictogramas]
  );
  */

  const crearPictograma = useCallback(
  async ({ pictogramName, description = '', categoryId, file }) => {
    setErrorPictogramas(null);

    const idPadre = localStorage.getItem('userId') || userId;
    if (!idPadre) {
      throw new Error('NO_TUTOR_SESSION');
    }

    setLoadingPictogramas(true);

    try {
      const formData = new FormData();
      formData.append('pictogramName', pictogramName.trim());
      formData.append('description', description.trim());
      formData.append('categoryId', categoryId);
      formData.append('userId', idPadre);

      if (ninoActivo?.id) {
        formData.append('infantId', ninoActivo.id);
      }

      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('http://localhost:3000/pictogram', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'CREATION_ERROR');
      }

      // Recargar catálogo del tutor y devolver respuesta
      await cargarPictogramas(idPadre);
      return data;
    } catch (err) {
      console.error('Error al crear pictograma:', err);
      setErrorPictogramas(err.message || 'Error al registrar pictograma');
      throw err;
    } finally {
      setLoadingPictogramas(false);
    }
  },
  [userId, token, ninoActivo, cargarPictogramas]
);

  // Actualizar pictograma
  /*
  const actualizarPictograma = useCallback(
    async (idPictograma, datosActualizados) => {
      const idInfante = ninoActivo?.id || null;
      setLoadingPictogramas(true);

      try {
        let headers = token ? { Authorization: `Bearer ${token}` } : {};
        let body;

        if (datosActualizados instanceof FormData) {
          if (idInfante && !datosActualizados.has('infantId')) {
            datosActualizados.append('infantId', idInfante);
          }
          body = datosActualizados;
        } else {
          headers['Content-Type'] = 'application/json';
          body = JSON.stringify({
            ...datosActualizados,
            ...(idInfante ? { infantId: idInfante } : {}),
          });
        }

        const response = await fetch(
          `http://localhost:3000/pictogram/${idPictograma}`,
          {
            method: 'PUT',
            headers,
            body,
          }
        );

        if (!response.ok) throw new Error('UPDATE_PICTOGRAM_ERROR');

        const id = userId || localStorage.getItem('userId');
        await cargarPictogramas(id);
      } catch (err) {
        console.error('Error al actualizar pictograma:', err);
        throw err;
      } finally {
        setLoadingPictogramas(false);
      }
    },
    [userId, token, ninoActivo, cargarPictogramas]
  );
  */

  // Eliminar pictograma
  /*
  const eliminarPictograma = useCallback(
    async (idPictograma) => {
      setLoadingPictogramas(true);
      try {
        const response = await fetch(
          `http://localhost:3000/pictogram/${idPictograma}`,
          {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!response.ok) throw new Error('DELETE_PICTOGRAM_ERROR');

        const id = userId || localStorage.getItem('userId');
        await cargarPictogramas(id);
      } catch (err) {
        console.error('Error al eliminar pictograma:', err);
        throw err;
      } finally {
        setLoadingPictogramas(false);
      }
    },
    [userId, token, cargarPictogramas]
  );*/

  const value = useMemo(
    () => ({
      pictogramas,
      loadingPictogramas,
      errorPictogramas,
      cargarPictogramas,
      crearPictograma,
      //actualizarPictograma,
      //eliminarPictograma,
    }),
    [
      pictogramas,
      loadingPictogramas,
      errorPictogramas,
      cargarPictogramas,
      crearPictograma,
      //actualizarPictograma,
      //eliminarPictograma,
    ]
  );

  return (
    <PictogramaContext.Provider value={value}>
      {children}
    </PictogramaContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePictogramas() {
  const context = useContext(PictogramaContext);
  if (!context) {
    throw new Error('usePictogramas debe usarse dentro de un PictogramaProvider');
  }
  return context;
}