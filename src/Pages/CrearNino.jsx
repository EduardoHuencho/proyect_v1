import Fondo from '../Components/Fondo';
import NavbarDev from '../Components/NavbarDev';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNino } from '../context/NinoContext';

function CrearNino() {
  const { tutorAutenticado, tutorOrigen } = useNino();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const navigate = useNavigate();

  function handleCrearNino(e) {
    e.preventDefault();
    alert('Vista estática: Formulario enviado simuladamente.');
    navigate('/accesotutor');
  }

  return (
    <Fondo>
      <div className="flex flex-col h-screen">
        <NavbarDev
          rol={tutorAutenticado ? 'tutor' : 'nino'}
          esPictogramas={false}
          rutaVolver={
            tutorAutenticado
              ? tutorOrigen === 'global'
                ? '/dashboardtutor'
                : '/accesotutor'
              : '/accesotutor'
          }
          labelVolver="Volver"
          pinSoloDesbloquea={true}
        />

        <div className="flex-1 flex items-center justify-center px-6 w-full overflow-y-auto">
          <div className="w-full max-w-md rounded-[30px] p-6 md:p-8 shadow-2xl bg-white max-h-[85vh] overflow-y-auto scrollbar-thin">
            <h2 className="text-2xl font-extrabold text-[#005088] mb-1 text-center">
              Nuevo Perfil de Infante
            </h2>
            <p className="text-sm text-[#4A7A96] font-medium mb-6 text-center">
              Ingresa los datos del niño para crear su perfil
            </p>

            <form onSubmit={handleCrearNino} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <label htmlFor="nombre-nino" className="sr-only">Nombre</label>
                <input
                  id="nombre-nino"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_16px] outline-none placeholder:text-[#003052]/50"
                />
                <label htmlFor="apellido-nino" className="sr-only">Apellido</label>
                <input
                  id="apellido-nino"
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_16px] outline-none placeholder:text-[#003052]/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="fecha-nacimiento" className="text-xs font-bold text-[#005088] px-1">
                  FECHA DE NACIMIENTO
                </label>
                <input
                  id="fecha-nacimiento"
                  type="date"
                  required
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="w-full font-medium bg-[#B0C8DC] border-[2.5px] border-[#7A9AB8] rounded-[14px] text-[#003052] text-base p-[11px_16px] outline-none placeholder:text-[#003052]/50 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 rounded-[18px] font-extrabold text-xl bg-[#FDD835] text-[#003052] border-3 border-[#C8A800] shadow-[0_6px_0_#C8A800] transition-colors hover:scale-105 active:scale-95 active:shadow-[0_4px_0_#C8A800]"
              >
                CREAR PERFIL
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => navigate('/accesotutor')}
                className="text-sm font-bold text-[#4A7A96] hover:text-[#005088] transition-colors focus:outline-none"
              >
                Cancelar y volver
              </button>
            </div>
          </div>
        </div>

        <div className="h-6 shrink-0 hidden md:block"></div>
      </div>
    </Fondo>
  );
}

export default CrearNino;