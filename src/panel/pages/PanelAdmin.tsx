import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Search, RotateCcw, Calendar, Filter, Image as ImageIcon } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import PictogramaModeracionCard from '../components/PictogramaModeracionCard';
import type {
  AdminPictogram,
  VisibilityFilter,
  DateSortOrder,
} from '../types/adminPictogram';

// Mocks realistas con fecha ISO y visibilidad pública/privada
const MOCK_PICTOGRAMAS_ADMIN: AdminPictogram[] = [
  {
    id: 'pic-1',
    name: 'Comer Manzana',
    category: 'Alimentación',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'María',
    authorLastName: 'González',
    authorEmail: 'maria.gonzalez@example.com',
    createdAt: '2026-11-10T09:30:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-2',
    name: 'Gesto Inapropiado',
    category: 'Emociones',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'Juan',
    authorLastName: 'Valenzuela',
    authorEmail: 'juan.valenzuela@test.com',
    createdAt: '2026-11-09T18:15:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-3',
    name: 'Ir al Baño',
    category: 'Rutinas',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'Carlos',
    authorLastName: 'Pérez',
    authorEmail: 'carlos.terapia@educa.org',
    createdAt: '2026-11-08T11:00:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-4',
    name: 'Mi Mascota Toby',
    category: 'Personal',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=60',
    isPublic: false,
    authorFirstName: 'Camila',
    authorLastName: 'Fernández',
    authorEmail: 'camila.f@familia.cl',
    createdAt: '2026-11-07T16:45:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-5',
    name: 'Cepillarse Dientes',
    category: 'Higiene',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e1032b4b455c?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'Ana',
    authorLastName: 'Ruiz',
    authorEmail: 'ana.ruiz@clinica.cl',
    createdAt: '2026-11-05T08:20:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-6',
    name: 'Foto Familiar',
    category: 'Personal',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&auto=format&fit=crop&q=60',
    isPublic: false,
    authorFirstName: 'Pedro',
    authorLastName: 'Morales',
    authorEmail: 'pedro.m@gmail.com',
    createdAt: '2026-11-04T12:00:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-7',
    name: 'Jugar con Pelota',
    category: 'Juegos',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'Sofía',
    authorLastName: 'López',
    authorEmail: 'sofia.lopez@escuela.edu',
    createdAt: '2026-11-03T15:10:00Z',
    isDeleted: false,
  },
  {
    id: 'pic-8',
    name: 'Beber Agua',
    category: 'Alimentación',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300&auto=format&fit=crop&q=60',
    isPublic: true,
    authorFirstName: 'Martín',
    authorLastName: 'Silva',
    authorEmail: 'martin.silva@terapia.com',
    createdAt: '2026-11-01T17:30:00Z',
    isDeleted: false,
  },
];

export function PanelAdmin() {
  const [pictogramas, setPictogramas] = useState<AdminPictogram[]>(MOCK_PICTOGRAMAS_ADMIN);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [sortOrder, setSortOrder] = useState<DateSortOrder>('newest');

  // Total de pictogramas en la plataforma
  const totalPictogramas = pictogramas.length;

  // Filtrado y ordenamiento reactivo
  const filteredAndSorted = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    // 1. Filtrar por término de búsqueda y visibilidad
    const filtered = pictogramas.filter((p) => {
      const fullName = `${p.authorFirstName} ${p.authorLastName}`.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        p.authorEmail.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (visibilityFilter === 'public') return p.isPublic;
      if (visibilityFilter === 'private') return !p.isPublic;
      return true; // 'all'
    });

    // 2. Ordenar por fecha de creación
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [pictogramas, searchTerm, visibilityFilter, sortOrder]);

  // Manejo de borrado
  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setPictogramas((prev) =>
          prev.map((pic) => (pic.id === id ? { ...pic, isDeleted: true } : pic))
        );

        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  };

  // Manejo de restauración
  const handleRestore = (id: string) => {
    setPictogramas((prev) =>
      prev.map((pic) => (pic.id === id ? { ...pic, isDeleted: false } : pic))
    );

    Swal.fire({
      icon: 'success',
      title: 'Restaurado',
      text: 'El pictograma ha sido reactivado.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra superior de administración */}
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Barra superior con contador total y controles de filtro */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Contador total y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Contador de pictogramas totales */}
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 shrink-0">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold">Total:</span>
              <span className="text-sm font-bold text-indigo-700">{totalPictogramas}</span>
            </div>

            {/* Input de Búsqueda */}
            <div className="relative flex-1 min-w-55">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, categoría, creador o correo..."
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

          {/* Filtros: Visibilidad y Orden por fecha */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filtro: Públicos / Privados / Todos */}
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

            {/* Orden: Fecha de creación */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as DateSortOrder)}
                className="bg-transparent text-xs font-medium text-gray-700 py-1 pr-2 pl-1 rounded focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Más recientes primero</option>
                <option value="oldest">Más antiguos primero</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grilla más compacta para mostrar mayor cantidad de pictogramas */}
        {filteredAndSorted.length === 0 ? (
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
                onRestore={handleRestore}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PanelAdmin;
