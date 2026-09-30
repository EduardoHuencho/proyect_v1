import { useRef, useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFolderOpen, faCheck, faTimes, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import MarcoAvatarPreview, { type ImagenPreviewHandle } from '../Components/ImagenPreview';

interface TarjetaImagenAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  onSeleccionar: (url: string, archivo: File | null) => void;
}

function TarjetaImagenAvatar({ isOpen, onClose, onSeleccionar }: TarjetaImagenAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const marcoRef = useRef<ImagenPreviewHandle | null>(null);

  const [modoWebcamPC, setModoWebcamPC] = useState(false);
  const [imagenTemporal, setImagenTemporal] = useState<string | null>(null);
  const [archivoReal, setArchivoReal] = useState<File | null>(null);
  const [streamActivo, setStreamActivo] = useState<MediaStream | null>(null);

  const cerrarWebcamPC = useCallback(() => {
    if (streamActivo) {
      streamActivo.getTracks().forEach((track) => track.stop());
      setStreamActivo(null);
    }
    setModoWebcamPC(false);
  }, [streamActivo]);

  useEffect(() => {
    return () => {
      if (streamActivo) {
        streamActivo.getTracks().forEach((track) => track.stop());
      }
    };
  }, [streamActivo]);

  const handleCerrarModal = useCallback(() => {
    cerrarWebcamPC();
    if (imagenTemporal && imagenTemporal.startsWith('blob:')) {
      URL.revokeObjectURL(imagenTemporal);
    }
    setImagenTemporal(null);
    setArchivoReal(null);
    onClose();
  }, [cerrarWebcamPC, imagenTemporal, onClose]);

  if (!isOpen) return null;

  const handleSubirArchivo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB.');
        e.target.value = '';
        return;
      }
      if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
        alert('Formato no permitido. Solo se aceptan imágenes JPEG, PNG, WEBP o GIF.');
        e.target.value = '';
        return;
      }
      setArchivoReal(file);
      const urlTemporal = URL.createObjectURL(file);
      setImagenTemporal(urlTemporal);
    }
    e.target.value = '';
  };

  const esMovil = () =>
    /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);

  const abrirCamara = async () => {
    if (esMovil()) {
      cameraInputRef.current?.click();
    } else {
      setModoWebcamPC(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
          audio: false,
        });
        setStreamActivo(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Verifica los permisos.');
        setModoWebcamPC(false);
      }
    }
  };

  const capturarWebcamPC = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const fileFromWebcam = new File([blob], `avatar_webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setArchivoReal(fileFromWebcam);
        
        const urlFoto = URL.createObjectURL(blob);
        cerrarWebcamPC();
        setImagenTemporal(urlFoto);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleConfirmarAjuste = async () => {
    if (marcoRef.current) {
      const urlFinalRecortada = await marcoRef.current.obtenerImagenRecortada();
      if (urlFinalRecortada) {
        let archivoFinal: File | null = archivoReal;
        try {
          const res = await fetch(urlFinalRecortada);
          const blob = await res.blob();
          archivoFinal = new File([blob], `avatar_recortado_${Date.now()}.jpg`, { type: 'image/jpeg' });
        } catch (err) {
          console.error('Error al procesar la imagen recortada:', err);
        }

        onSeleccionar(urlFinalRecortada, archivoFinal);
        handleCerrarModal();
        return;
      }
    }

    if (imagenTemporal && archivoReal) {
      onSeleccionar(imagenTemporal, archivoReal);
      handleCerrarModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="tarjeta-auth flex flex-col items-center shadow-2xl max-w-sm w-full animate-fadeIn">
        <h2 className="text-xl sm:text-2xl font-black text-[#1B3A5C] text-center mb-4">
          {modoWebcamPC
            ? 'Tomar foto'
            : imagenTemporal
            ? 'Ajustar imagen'
            : 'Fuente de imagen'}
        </h2>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          capture="user"
          className="hidden"
          onChange={handleSubirArchivo}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleSubirArchivo}
        />

        {imagenTemporal ? (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-xs text-[#78909C] text-center">
              Arrastra y haz zoom para centrar el rostro en el círculo
            </p>

            <MarcoAvatarPreview
              ref={marcoRef}
              src={imagenTemporal}
              editable={true}
              tamano="xl"
            />

            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                onClick={handleConfirmarAjuste}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheck} /> Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (imagenTemporal && imagenTemporal.startsWith('blob:')) {
                    URL.revokeObjectURL(imagenTemporal);
                  }
                  setImagenTemporal(null);
                  setArchivoReal(null);
                }}
                aria-label="Volver a elegir imagen"
                className="py-3 px-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
            </div>
          </div>
        ) : modoWebcamPC ? (
          <div className="w-full flex flex-col items-center gap-4">
            <MarcoAvatarPreview
              esVideo={true}
              videoRef={videoRef}
              tamano="xl"
            />

            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                onClick={capturarWebcamPC}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheck} /> Capturar
              </button>
              <button
                type="button"
                onClick={cerrarWebcamPC}
                aria-label="Cancelar captura"
                className="py-3 px-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-4 mb-6">
              <button
                type="button"
                onClick={abrirCamara}
                className="btn-logear-teayudo py-3.5 flex items-center justify-center gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCamera} className="text-xl" />
                <span>Abrir cámara</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-logear-teayudo py-3.5 flex items-center justify-center gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faFolderOpen} className="text-xl" />
                <span>Seleccionar imagen</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCerrarModal}
              className="text-sm font-semibold text-[#1B3A5C] hover:opacity-80 transition-opacity cursor-pointer"
            >
              Cancelar y volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TarjetaImagenAvatar;