import { useNavigate } from 'react-router';
import Navbar from '../Components/Navbar';
import ModuloCard from '../Components/ModuloCard';
import calendarioImg from '../assets/calendario.png';
import pictogramaImg from '../assets/menu-pictograma.png';
import analisisImg from '../assets/analisis.png';
import Fondo from '../Components/Fondo';

interface Modulo {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  borderColor: string;
  disponible: boolean;
  ruta?: string;
}

const modulos: Modulo[] = [
  {
    id: 'calendario',
    titulo: 'Calendario Semanal',
    descripcion: 'Gestiona el horario de la semana',
    imagen: calendarioImg,
    borderColor: '#1B3A5C',
    disponible: true,
    ruta: '/horariotutor',
  },
  {
    id: 'pictogramas',
    titulo: 'Pictogramas',
    descripcion: 'Crea frases con pictogramas',
    imagen: pictogramaImg,
    borderColor: '#1A7A6E',
    disponible: true,
    ruta: '/pictogramas',
  },
  {
    id: 'analisis',
    titulo: 'Análisis de Progreso',
    descripcion: 'Estadísticas y progreso',
    imagen: analisisImg,
    borderColor: '#C0440A',
    disponible: true,
    ruta: '/progresoinfante',
  },
];

function DashboardTutor() {
  const navigate = useNavigate();

  const handleModulo = (modulo: Modulo) => {
    if (!modulo.disponible || !modulo.ruta) return;
    navigate(modulo.ruta);
  };

  return (
    <Fondo>
      <Navbar rol="tutor" rutaVolver="/paneltutor" labelVolver="Volver" />

      <div className="text-center pt-8 mb-8">
        <h1 className="titulo-pagina">Dashboard Tutor</h1>
        <p className="text-[#4A7A96] mt-1">¿Qué quieres gestionar hoy?</p>
      </div>

      <div className="max-w-xl mx-auto px-6 pb-8">
        <div className="flex flex-col gap-5">
          {modulos.map((modulo) => (
            <ModuloCard
              key={modulo.id}
              titulo={modulo.titulo}
              descripcion={modulo.descripcion}
              imagen={modulo.imagen}
              borderColor={modulo.borderColor}
              disponible={modulo.disponible}
              variante="tutor"
              onClick={() => handleModulo(modulo)}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 py-6">
        TEAYUDO · Sistema educativo AAC
      </p>
    </Fondo>
  );
}

export default DashboardTutor;
