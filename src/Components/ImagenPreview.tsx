import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlassPlus, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import AvatarFallback from '../assets/panda.png';

type TamanoPreview = 'sm' | 'md' | 'lg' | 'xl';

interface ImagenPreviewProps {
  src?: string | null;
  videoRef?: RefObject<HTMLVideoElement | null>;
  esVideo?: boolean;
  editable?: boolean;
  tamano?: TamanoPreview;
  bordeDashed?: boolean;
  className?: string;
}

export interface ImagenPreviewHandle {
  obtenerImagenRecortada: () => Promise<string | null>;
}

const ImagenPreview = forwardRef<ImagenPreviewHandle, ImagenPreviewProps>(function MarcoAvatarPreview(
  {
    src = null,
    videoRef = null,
    esVideo = false,
    editable = false,
    tamano = 'xl',
    bordeDashed = false,
    className = '',
  },
  ref
) {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [arrastrando, setArrastrando] = useState(false);
  const inicioArrastre = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const contenedorRef = useRef<HTMLDivElement | null>(null);

  // reinicia la posicion y zoom cuando se cambia la imagen
  useEffect(() => {
    setPosicion({ x: 0, y: 0 });
    setZoom(1);
  }, [src]);

  // Muestra la imagen de la forma en la que se ve dentro del marco
  useImperativeHandle(ref, () => ({
    obtenerImagenRecortada: () => {
      return new Promise((resolve) => {
        const img = imgRef.current;
        const contenedor = contenedorRef.current;
        if (!img || !contenedor) return resolve(null);

        const canvas = document.createElement('canvas');
        const diametro = 320; // Resolución fija de salida
        canvas.width = diametro;
        canvas.height = diametro;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        // crea marco circular para el recorte
        ctx.beginPath();
        ctx.arc(diametro / 2, diametro / 2, diametro / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const rectContenedor = contenedor.getBoundingClientRect();
        const escalaCanvas = diametro / rectContenedor.width;

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const escalaBase = Math.max(rectContenedor.width / imgWidth, rectContenedor.height / imgHeight);

        const anchoFinal = imgWidth * escalaBase * zoom * escalaCanvas;
        const altoFinal = imgHeight * escalaBase * zoom * escalaCanvas;

        const centroX = diametro / 2 + posicion.x * escalaCanvas;
        const centroY = diametro / 2 + posicion.y * escalaCanvas;

        ctx.drawImage(
          img,
          centroX - anchoFinal / 2,
          centroY - altoFinal / 2,
          anchoFinal,
          altoFinal
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(null);
          }
        }, 'image/jpeg', 0.95);
      });
    },
  }));

  // manejo de mouse para arrastrar la imagen
  const iniciarArrastre = (clienteX: number, clienteY: number) => {
    if (!editable || esVideo || !src) return;
    setArrastrando(true);
    inicioArrastre.current = {
      x: clienteX - posicion.x,
      y: clienteY - posicion.y,
    };
  };

  const mover = (clienteX: number, clienteY: number) => {
    if (!arrastrando) return;
    setPosicion({
      x: clienteX - inicioArrastre.current.x,
      y: clienteY - inicioArrastre.current.y,
    });
  };

  const terminarArrastre = () => setArrastrando(false);

  const mapaTamanos = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-48 h-48 sm:w-56 sm:h-56',
  };

  const claseTamano = mapaTamanos[tamano] || mapaTamanos.md;
  const estiloBorde = bordeDashed
    ? 'border-4 border-dashed border-[#1B3A5C]'
    : 'border-4 border-[#1B3A5C]';

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={contenedorRef}
        onMouseDown={(e) => iniciarArrastre(e.clientX, e.clientY)}
        onMouseMove={(e) => mover(e.clientX, e.clientY)}
        onMouseUp={terminarArrastre}
        onMouseLeave={terminarArrastre}
        onTouchStart={(e) => iniciarArrastre(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => mover(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={terminarArrastre}
        className={`rounded-full bg-[#E0F7FA] ${estiloBorde} flex items-center justify-center overflow-hidden shadow-lg shrink-0 relative select-none ${
          editable ? 'cursor-grab active:cursor-grabbing' : ''
        } ${claseTamano} ${className}`}
      >
        {esVideo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100 pointer-events-none"
          />
        ) : src ? (
          <img
            ref={imgRef}
            src={src}
            alt="Previsualización"
            draggable={false}
            style={{
              transform: `translate(${posicion.x}px, ${posicion.y}px) scale(${zoom})`,
              transition: arrastrando ? 'none' : 'transform 0.1s ease-out',
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = AvatarFallback;
            }}
            className="max-w-none w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-4xl text-[#1B3A5C]" />
        )}
      </div>

      {/* control de Zoom en modo edicion */}
      {editable && src && !esVideo && (
        <div className="flex items-center gap-2 w-48 sm:w-56 px-2 py-1 bg-[#F0F4F8] rounded-full border border-[#CBD5E0]">
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="text-xs text-[#1B3A5C]" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#1B3A5C] cursor-pointer"
          />
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="text-xs text-[#1B3A5C]" />
        </div>
      )}
    </div>
  );
});

export default ImagenPreview;