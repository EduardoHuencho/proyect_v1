interface TarjetaInfoJuegoProps {
  imagen: string;
  titulo: string;
  alt?: string;
  className?: string;
}

export function TarjetaInfoJuego({
  imagen,
  titulo,
  alt,
  className = '',
}: TarjetaInfoJuegoProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#1B3A5C] shadow-[0_4px_0_#1B3A5C] flex flex-col items-center text-center justify-between ${className}`}
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-blue-50 border-2 border-black flex items-center justify-center p-3 mb-4 overflow-hidden shadow-inner">
        <img
          src={imagen}
          alt={alt || titulo}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="font-extrabold text-lg sm:text-xl text-[#1B3A5C] uppercase tracking-wide">
        {titulo}
      </h3>
    </div>
  );
}

export default TarjetaInfoJuego;
