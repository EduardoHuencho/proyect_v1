import { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  Search,
  RotateCcw,
  Filter,
  Image as ImageIcon,
  ArrowDownAZ,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../components/AdminHeader';
import PictogramaModeracionCard from '../components/PictogramaModeracionCard';
import { getAllPictogramsAdmin } from '../services/adminPictogramsService';
import type {
  AdminPictogram,
  VisibilityFilter,
  NameSortOrder,
} from '../types/adminPictogram';
import { deletePictogramAdmin } from '../services/adminPictogramsService';
//import { eliminarActividadesDePictograma } from '../../services/routineService';
import { deleteRoutineActivity } from '../../services/routineService';

const POLLING_INTERVAL_MS = 15_000;

function obtenerMensajeError(err: unknown): string {
  if (err instanceof Error && err.message === 'HTTP_ERROR_403') {
    return 'No tienes permisos de administrador para acceder a estos datos.';
  }
  return 'No se pudieron cargar los pictogramas desde el servidor.';
}

export function PanelAdmin() {
  const { token } = useAuth();

  const [pictogramas, setPictogramas] = useState<AdminPictogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [sortOrder, setSortOrder] = useState<NameSortOrder>('asc');

  const cargarPictogramas = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const data = await getAllPictogramsAdmin(token);
      setPictogramas(data);
    } catch (err) {
      console.error('Error al cargar pictogramas en el panel:', err);
      setError(obtenerMensajeError(err));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelado = false;

    const sincronizar = (esCargaInicial: boolean) => {
      getAllPictogramsAdmin(token)
        .then((data) => {
          if (!cancelado) {
            setPictogramas(data);
            setError(null);
          }
        })
        .catch((err) => {
          if (!cancelado) {
            console.error('Error al cargar pictogramas en el panel:', err);
            if (esCargaInicial) {
              setError(obtenerMensajeError(err));
            }
          }
        })
        .finally(() => {
          if (!cancelado && esCargaInicial) {
            setLoading(false);
          }
        });
    };

    sincronizar(true);

    // Polling silencioso cada 15 segundos mientras la pestaña esté visible
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        sincronizar(false);
      }
    }, POLLING_INTERVAL_MS);

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        sincronizar(false);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      cancelado = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [token]);

  const totalPictogramas = pictogramas.length;

  const filteredAndSorted = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const filtered = pictogramas.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (visibilityFilter === 'public') return p.isPublic;
      if (visibilityFilter === 'private') return !p.isPublic;
      return true;
    });

    return filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [pictogramas, searchTerm, visibilityFilter, sortOrder]);

  const handleDelete = (pic: AdminPictogram) => {
    Swal.fire({
      title: `¿Eliminar "${pic.name}"?`,
      text: pic.isPublic
        ? 'Este es un pictograma público. Si algún niño lo está usando en su rutina, se desvinculará antes de borrar.'
        : 'Este pictograma se eliminará y se desvinculará de las rutinas de todos los niños asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4f46e5',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        
        if (pic.infantId && pic.infantId.length > 0) {
          for (const infantId of pic.infantId) {
            try {
              // await eliminarActividadesDePictograma(pic.id, infantId, token);
              await deleteRoutineActivity(pic.id, infantId, token);
            } catch (e) {
              console.warn(`No se pudieron limpiar rutinas del infante ${infantId}:`, e);
            }
          }
        }

        await deletePictogramAdmin(pic.id, token);

        setPictogramas((prev) => prev.filter((item) => item.id !== pic.id));

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El pictograma y sus actividades asociadas han sido eliminados.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Error al eliminar en panel admin:', err);
        Swal.fire({
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el pictograma. Comprueba si está siendo usado por otros usuarios.',
          icon: 'error',
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">

            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 shrink-0">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold">Total:</span>
              <span className="text-sm font-bold text-indigo-700">{totalPictogramas}</span>
            </div>

            <div className="relative flex-1 min-w-55">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, categoría o descripción..."
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <Filter className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as VisibilityFilter)}
                className="bg-transparent text-xs font-medium text-gray-700 py-1 pr-2 pl-1 rounded focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todas las visibilidades</option>
                <option value="public">Solo Públicos</option>
                <option value="private">Solo Privados</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <ArrowDownAZ className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as NameSortOrder)}
                className="bg-transparent text-xs font-medium text-gray-700 py-1 pr-2 pl-1 rounded focus:outline-hidden cursor-pointer"
              >
                <option value="asc">Nombre (A - Z)</option>
                <option value="desc">Nombre (Z - A)</option>
              </select>
            </div>

            <button
              onClick={cargarPictogramas}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              title="Actualizar lista de pictogramas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-medium">Cargando pictogramas...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-red-200 p-10 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900">Error al obtener datos</h3>
            <p className="text-xs text-gray-600 mt-1 max-w-md">{error}</p>
            <button
              onClick={cargarPictogramas}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <RotateCcw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-800">No se encontraron pictogramas</h3>
            <p className="text-xs text-gray-500 mt-1">
              Prueba cambiando la búsqueda o los filtros de visibilidad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredAndSorted.map((pic) => (
              <PictogramaModeracionCard
                key={pic.id}
                pictogram={pic}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PanelAdmin;
