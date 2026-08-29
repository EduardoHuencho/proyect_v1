import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useNino } from '../context/NinoContext';
import Navbar from '../Components/Navbar';
import ModuloCard from '../Components/ModuloCard';
import calendarioImg from '../assets/calendario.png';
import pictogramaImg from '../assets/pictograma.png';
import juegosImg from '../assets/juegos.png';
import Avatar from '../assets/panda.png';
import Fondo from '../Components/Fondo';

const modulos = [
  {
    id: 'horario',
    titulo: 'HORARIO',
    imagen: calendarioImg,
    borderColor: '#1E88E5',
    disponible: false,
  },
  {
    id: 'pictogramas',
    titulo: 'PICTOGRAMAS',
    imagen: pictogramaImg,
    borderColor: '#FDD835',
    disponible: true,
    ruta: '/pictogramas',
  },
  {
    id: 'juegos',
    titulo: 'JUEGOS',
    imagen: juegosImg,
    borderColor: '#E91E8C',
    disponible: true,
    ruta: '/menuJuegos',
  },
];

const obtenerImagenAvatar = (avatarUrl) => {
  if (avatarUrl && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  return Avatar;
};

function MenuModulos() {
  const navigate = useNavigate();
  const { ninoActivo } = useNino();

  useEffect(() => {
    if (!ninoActivo) {
      navigate('/accesotutor');
    }
  }, [ninoActivo, navigate]);

  if (!ninoActivo) return null;

  const handleModulo = (modulo) => {
    if (!modulo.disponible) return;
    navigate(modulo.ruta);
  };

  return (
    <Fondo>
      <Navbar rol="nino" />

      <div className="contenedor-pagina py-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-[#FDD835] border-4 border-white shadow-lg overflow-hidden shrink-0">
          <img
            src={obtenerImagenAvatar(ninoActivo.avatarUrl)}
            alt={ninoActivo.firstName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = Avatar;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="titulo-pagina mb-8 text-center">
          ¡Hola, {ninoActivo.firstName}!
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <ModuloCard
              key={modulo.id}
              titulo={modulo.titulo}
              imagen={modulo.imagen}
              borderColor={modulo.borderColor}
              disponible={modulo.disponible}
              variante="nino"
              onClick={() => handleModulo(modulo)}
            />
          ))}
        </div>
      </div>
    </Fondo>
  );
}

export default MenuModulos;