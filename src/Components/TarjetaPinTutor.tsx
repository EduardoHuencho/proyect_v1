import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface TarjetaPinTutorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function TarjetaPinTutor({ isOpen, onClose, onSuccess }: TarjetaPinTutorProps) {
  const { validatePin } = useAuth();
  const [pin, setPin] = useState('');
  const [errorPin, setErrorPin] = useState(false);
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleNumero = (num: string) => {
    if (pin.length >= 4 || cargando) return;
    const nuevoPin = pin + num;
    setPin(nuevoPin);
    setErrorPin(false);

    if (nuevoPin.length === 4) {
      setCargando(true);
      setTimeout(async () => {
        try {
          const esValido = await validatePin(nuevoPin);

          if (esValido) {
            setPin('');
            setErrorPin(false);
            onSuccess();
          } else {
            manejarErrorPin();
          }
        } catch (error) {
          console.error('Error al validar el PIN:', error);
          manejarErrorPin();
        } finally {
          setCargando(false);
        }
      }, 200);
    }
  };

  const manejarErrorPin = () => {
    setErrorPin(true);
    setTimeout(() => {
      setPin('');
      setErrorPin(false);
    }, 800);
  };

  const handleBorrar = () => {
    if (cargando) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorPin(false);
  };

  const handleCerrar = () => {
    if (cargando) return;
    setPin('');
    setErrorPin(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 landscape:p-2">
      <div
        className={`tarjeta-auth p-6 sm:p-8 landscape:p-3 landscape:max-w-xs landscape:rounded-2xl md:landscape:max-w-sm md:landscape:p-8 md:landscape:rounded-[30px] ${
          errorPin ? 'animate-shake' : ''
        }`}
      >
        <div className="bg-blue-300 rounded-full px-6 py-2 landscape:px-4 landscape:py-0.5 md:landscape:px-6 md:landscape:py-2 w-fit mx-auto shadow-sm mb-3 sm:mb-4 landscape:mb-1.5 md:landscape:mb-4">
          <h2 className="text-xl font-extrabold text-[#1B3A5C] text-center landscape:text-xs md:landscape:text-xl">
            Acceso de tutor
          </h2>
        </div>

        <p className="text-sm text-[#78909C] text-center mb-4 sm:mb-6 landscape:mb-1.5 md:landscape:mb-6 landscape:text-[11px] md:landscape:text-sm">
          {cargando ? 'Validando PIN...' : 'Ingresa tu PIN de 4 dígitos'}
        </p>

        <div className="flex justify-center gap-4 mb-4 sm:mb-6 landscape:gap-2.5 landscape:mb-2 md:landscape:gap-4 md:landscape:mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 landscape:w-2.5 landscape:h-2.5 md:landscape:w-4 md:landscape:h-4 rounded-full transition-colors"
              style={{
                background:
                  i < pin.length
                    ? errorPin
                      ? '#E53935'
                      : '#1B3A5C'
                    : '#CBD5E0',
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 landscape:gap-1.5 md:landscape:gap-3 mb-4 landscape:mb-1 md:landscape:mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={cargando}
              onClick={() => handleNumero(String(num))}
              className="btn-pin h-11 sm:h-14 landscape:h-7.5 landscape:text-base landscape:rounded-xl md:landscape:h-14 md:landscape:text-xl md:landscape:rounded-2xl disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={cargando}
            onClick={handleBorrar}
            aria-label="Borrar último dígito"
            className="btn-pin h-11 sm:h-14 landscape:h-7.5 hover:bg-red-50 text-[#E53935] text-sm landscape:text-xs landscape:rounded-xl md:landscape:h-14 md:landscape:text-sm md:landscape:rounded-2xl disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faDeleteLeft} />
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={() => handleNumero('0')}
            className="btn-pin h-11 sm:h-14 landscape:h-7.5 landscape:text-base landscape:rounded-xl md:landscape:h-14 md:landscape:text-xl md:landscape:rounded-2xl disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={handleCerrar}
            aria-label="Cerrar acceso de tutor"
            className="btn-pin h-11 sm:h-14 landscape:h-7.5 hover:bg-red-50 text-[#78909C] text-sm landscape:text-xs landscape:rounded-xl md:landscape:h-14 md:landscape:text-sm md:landscape:rounded-2xl disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {errorPin && (
          <p className="text-center text-sm text-red-500 font-semibold mt-2 landscape:mt-0.5 landscape:text-xs md:landscape:text-sm">
            PIN incorrecto, intenta de nuevo
          </p>
        )}
      </div>
    </div>
  );
}

export default TarjetaPinTutor;