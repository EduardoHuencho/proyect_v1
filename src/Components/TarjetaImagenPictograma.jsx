import { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faFolderOpen,
  faCheck,
  faTimes,
  faArrowRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

function TarjetaImagenPictograma({ isOpen, onClose, onSeleccionar }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);

  const [modoWebcamPC, setModoWebcamPC] = useState(false);
  const [imagenTemporal, setImagenTemporal] = useState(null);
  const [archivoTemporal, setArchivoTemporal] = useState(null);
  const [streamActivo, setStreamActivo] = useState(null);

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
    if (imagenTemporal) {
      URL.revokeObjectURL(imagenTemporal);
    }
    setImagenTemporal(null);
    setArchivoTemporal(null);
    onClose();
  }, [cerrarWebcamPC, imagenTemporal, onClose]);

  if (!isOpen) return null;

  const esMovil = () =>
    /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);

  const handleSubirArchivo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagenTemporal(url);
      setArchivoTemporal(file);
    }
    e.target.value = '';
  };

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

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camara_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const urlFoto = URL.createObjectURL(file);
        cerrarWebcamPC();
        setImagenTemporal(urlFoto);
        setArchivoTemporal(file);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleConfirmar = () => {
    if (archivoTemporal && imagenTemporal) {
      onSeleccionar(archivoTemporal, imagenTemporal);
      cerrarWebcamPC();
      setImagenTemporal(null);
      setArchivoTemporal(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="tarjeta-auth flex flex-col items-center shadow-2xl max-w-sm w-full animate-fadeIn">
        <h2 className="text-xl sm:text-2xl font-black text-[#1B3A5C] text-center mb-4">
          {modoWebcamPC
            ? 'Tomar foto'
            : imagenTemporal
            ? 'Vista previa'
            : 'Fuente de imagen'}
        </h2>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleSubirArchivo}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSubirArchivo}
        />

        {imagenTemporal ? (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-xs text-[#78909C] text-center">
              Confirma si la imagen es adecuada para el pictograma
            </p>

            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#1A7A6E] bg-[#E0F7FA]/30 flex items-center justify-center shadow-inner">
              <img
                src={imagenTemporal}
                alt="Vista previa seleccionada"
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                onClick={handleConfirmar}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheck} /> Usar imagen
              </button>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(imagenTemporal);
                  setImagenTemporal(null);
                  setArchivoTemporal(null);
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
            <div className="w-56 h-56 rounded-2xl overflow-hidden border-2 border-[#1A7A6E] bg-black relative flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>

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

export default TarjetaImagenPictograma;