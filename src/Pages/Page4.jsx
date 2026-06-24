import React from 'react';
import { useNavigate } from 'react-router';
import NavbarDev from '../Components/NavbarDev';
import ModuloCard from '../Components/ModuloCard';
import calendarioImg from '../assets/calendario.png';
import pictogramaImg from '../assets/pictograma.png';
import juegosImg from '../assets/juegos.png';
import analisisImg from '../assets/analisis.png';
import Fondo from '../Components/Fondo';

const modulos = [
  {
    id: 'calendario',
    titulo: 'Calendario Semanal',
    descripcion: 'Gestiona el horario de la semana',
    imagen: calendarioImg,
    borderColor: '#1B3A5C',
    disponible: false,
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
    id: 'juegos',
    titulo: 'Juegos',
    descripcion: '¿Qué Es? y Cuentitos',
    imagen: juegosImg,
    borderColor: '#6B3FA0',
    disponible: true,
    ruta: '/menuJuegos',
  },
  {
    id: 'analisis',
    titulo: 'Análisis de Progreso',
    descripcion: 'Estadísticas y progreso',
    imagen: analisisImg,
    borderColor: '#C0440A',
    disponible: false,
  },
];

function Page4() {
  const navigate = useNavigate();

  const handleModulo = (modulo) => {
    if (!modulo.disponible) return;
    navigate(modulo.ruta);
  };

  return (
    <Fondo>
      <NavbarDev rol="tutor" rutaVolver="/page3" labelVolver="Volver" />

      <div className="text-center pt-8 mb-8">
        <h1 className="text-3xl font-extrabold text-[#1B3A5C]">
          Dashboard Tutor
        </h1>
        <p className="text-[#4A7A96] mt-1">¿Qué quieres gestionar hoy?</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

export default Page4;
