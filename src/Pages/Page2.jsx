import React from 'react';
import { useNavigate } from 'react-router';
import { useNino } from '../context/NinoContext';
import NavbarDev from '../Components/NavbarDev';
import ModuloCard from '../Components/ModuloCard';
import calendarioImg from '../assets/calendario.png';
import pictogramaImg from '../assets/pictograma.png';
import juegosImg from '../assets/juegos.png';
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

function Page2() {
  const navigate = useNavigate();
  const { ninoActivo } = useNino();

  const handleModulo = (modulo) => {
    if (!modulo.disponible) return;
    navigate(modulo.ruta);
  };

  return (
    <Fondo>
      <NavbarDev rol="nino" />

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mb-4 bg-[#FDD835] border-4 border-white shadow-lg">
          {ninoActivo ? ninoActivo.avatar_url : '👤'}
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B3A5C] mb-8 text-center">
          {ninoActivo ? `¡Hola, ${ninoActivo.nombre}!` : '¡Hola!'}
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

export default Page2;
