import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faDoorOpen, faGear, faArrowLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { useNino } from '../context/NinoContext'
import logoImg from '../assets/logo.png'

const PIN_CORRECTO = '1234'

function NavbarDev({ rol, rutaVolver = null, labelVolver = 'Volver', pinSoloDesbloquea = false, esPictogramas = false }) {
  const navigate = useNavigate()
  const { tutorAutenticado, setTutorAutenticado, tutorOrigen, setTutorOrigen } = useNino()
  const [mostrarPin, setMostrarPin] = useState(false)
  const [pin, setPin] = useState('')
  const [errorPin, setErrorPin] = useState(false)

  const handleNumero = (num) => {
    if (pin.length >= 4) return
    const nuevoPin = pin + num
    setPin(nuevoPin)
    setErrorPin(false)

    if (nuevoPin.length === 4) {
      setTimeout(() => {
        if (nuevoPin === PIN_CORRECTO) {
          setPin('')
          setMostrarPin(false)
          setTutorAutenticado(true)
          if (pinSoloDesbloquea) {
            setTutorOrigen('local')  
          } else {
            setTutorOrigen('global')
            navigate('/page3')
          }
        } else {
          setErrorPin(true)
          setTimeout(() => { setPin(''); setErrorPin(false) }, 800)
        }
      }, 200)
    }
  }

  const handleBorrar = () => { setPin(pin.slice(0, -1)); setErrorPin(false) }
  const handleCerrar = () => { setMostrarPin(false); setPin(''); setErrorPin(false) }

  const handleSalirTutor = () => {
    setTutorAutenticado(false)
    setTutorOrigen(null)
    navigate('/page1')
  }

  const handleGuardarYSalir = () => {
    setTutorAutenticado(false)
    setTutorOrigen(null)
  }

  return (
    <>
      <nav className="bg-[#1B3A5C] px-4 py-3 flex items-center justify-between">
        <div className="w-16 md:w-44 flex justify-start">
          {rutaVolver && (
            <button
              onClick={() => navigate(rutaVolver)}
              className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="hidden md:inline">{labelVolver}</span>
            </button>
          )}
        </div>

        <img src={logoImg} alt="Logo TEAYUDO" className="h-8 md:h-10 w-auto" />

        <div className="flex gap-2 w-16 md:w-44 justify-end">
          {rol === 'tutor' && (
            <>
              <div className="flex items-center gap-2 bg-[#2A4F73] text-white px-3 py-2 rounded-xl text-sm font-semibold">
                <FontAwesomeIcon icon={faUserTie} />
                <span className="hidden md:inline">Tutor</span>
              </div>

              {esPictogramas && tutorOrigen === 'local' && (
                <button
                  onClick={handleGuardarYSalir}
                  className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <span className="hidden md:inline">Guardar y salir</span>
                </button>
              )}

              {!esPictogramas && (
                <button
                  onClick={handleSalirTutor}
                  className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <FontAwesomeIcon icon={faDoorOpen} />
                  <span className="hidden md:inline">Salir</span>
                </button>
              )}
            </>
          )}

          {rol === 'selector' && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <FontAwesomeIcon icon={faDoorOpen} />
              <span className="hidden md:inline">Salir</span>
            </button>
          )}

          {rol === 'nino' && (
            <button
              onClick={() => setMostrarPin(true)}
              className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              title="Configuración Tutor"
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          )}

        </div>
      </nav>

      {mostrarPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl ${errorPin ? 'animate-shake' : ''}`}>
            <div className="bg-blue-300 rounded-full px-6 py-2 w-fit mx-auto shadow-sm mb-4">
              <h2 className="text-xl font-extrabold text-[#1B3A5C] text-center">Acceso de tutor</h2>
            </div>
            <p className="text-sm text-[#78909C] text-center mb-6">Ingresa tu PIN de 4 dígitos</p>

            <div className="flex justify-center gap-4 mb-6">
              {[0,1,2,3].map((i) => (
                <div key={i} className="w-4 h-4 rounded-full transition-all"
                  style={{ background: i < pin.length ? (errorPin ? '#E53935' : '#1B3A5C') : '#CBD5E0' }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button key={num} onClick={() => handleNumero(String(num))}
                  className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-[#E0F7FA] active:bg-[#B2EBF2] font-extrabold text-xl text-[#1B3A5C] transition-all active:scale-95">
                  {num}
                </button>
              ))}
              <button onClick={handleBorrar} className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-red-50 font-bold text-[#E53935] transition-all active:scale-95 text-sm">⌫</button>
              <button onClick={() => handleNumero('0')} className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-[#E0F7FA] active:bg-[#B2EBF2] font-extrabold text-xl text-[#1B3A5C] transition-all active:scale-95">0</button>
              <button onClick={handleCerrar} className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-red-50 font-bold text-[#78909C] transition-all active:scale-95 text-sm">✕</button>
            </div>

            {errorPin && <p className="text-center text-sm text-red-500 font-semibold mt-2">PIN incorrecto, intenta de nuevo</p>}
          </div>
        </div>
      )}
    </>
  )
}

export default NavbarDev