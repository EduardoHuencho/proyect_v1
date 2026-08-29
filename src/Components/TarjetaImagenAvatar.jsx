import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFolderOpen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function TarjetaImagenAvatar({ isOpen, onClose, onSeleccionar }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);

  const [modoWebcamPC, setModoWebcamPC] = useState(false);
  const [streamActivo, setStreamActivo] = useState(null);

  // Función para cerrar la webcam y resetear estados
  const cerrarWebcamPC = () => {
    if (streamActivo) {
      streamActivo.getTracks().forEach((track) => track.stop());
      setStreamActivo(null);
    }
    setModoWebcamPC(false);
  };

  // Manejador centralizado para cerrar el modal de forma segura
  const handleCerrarModal = () => {
    cerrarWebcamPC();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubirArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const urlTemporal = URL.createObjectURL(file);
      onSeleccionar(urlTemporal);
      handleCerrarModal();
    }
    e.target.value = '';
  };

  // Detectar si es un dispositivo móvil básico
  const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const abrirCamara = async () => {
    if (esMovil) {
      cameraInputRef.current?.click();
    } else {
      setModoWebcamPC(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 640 },
          audio: false,
        });
        setStreamActivo(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('No se pudo acceder a la cámara de la PC:', error);
        alert('No pudimos acceder a tu cámara. Revisa los permisos del navegador.');
        setModoWebcamPC(false);
      }
    }
  };

  const tomarFotoPC = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const urlTemporal = URL.createObjectURL(blob);
        onSeleccionar(urlTemporal);
        handleCerrarModal();
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="tarjeta-auth flex flex-col items-center shadow-xl">
        <h2 className="text-2xl font-black text-[#1B3A5C] text-center mb-6">
          {modoWebcamPC ? 'Tomar foto con PC' : 'Fuente de imagen'}
        </h2>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
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

        {modoWebcamPC ? (
          <div className="w-full flex flex-col items-center gap-4 mb-6">
            <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={tomarFotoPC}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 transition-all shadow"
              >
                <FontAwesomeIcon icon={faCheck} /> Capturar
              </button>
              <button
                type="button"
                onClick={cerrarWebcamPC}
                className="py-3 px-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center gap-2 transition-all"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-5 mb-8">
              <button
                type="button"
                onClick={abrirCamara}
                className="btn-logear-teayudo mt-2 py-3.5"
              >
                <FontAwesomeIcon icon={faCamera} className="text-2xl shrink-0" />
                <span>Abrir cámara</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-logear-teayudo mt-2 py-3.5"
              >
                <FontAwesomeIcon icon={faFolderOpen} className="text-2xl shrink-0" />
                <span>Seleccionar imagen</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCerrarModal}
              className="text-sm font-semibold text-[#1B3A5C] hover:opacity-80 transition-opacity"
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