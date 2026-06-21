import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import NinosList from '../Data/Ninos.json'
import { useNino } from '../context/NinoContext'
import NavbarDev from '../Components/NavbarDev'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const PIN_CORRECTO = '1234'

function Page1() {
  const navigate = useNavigate()
  const { setNinoActivo, setTutorAutenticado, setTutorOrigen } = useNino()

  const [mostrarPin, setMostrarPin] = useState(false)
  const [pin, setPin] = useState('')
  const [errorPin, setErrorPin] = useState(false)

  const calcularEdad = (fecha) => {
    const hoy = new Date()
    const nacimiento = new Date(fecha)
    return hoy.getFullYear() - nacimiento.getFullYear() + ' años'
  }

  const handleSeleccionarNino = (nino) => {
    setNinoActivo(nino)
    navigate('/page2')
  }

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
          setTutorOrigen('global')
          navigate('/page3')
        } else {
          setErrorPin(true)
          setTimeout(() => {
            setPin('')
            setErrorPin(false)
          }, 800)
        }
      }, 200)
    }
  }

  const handleBorrar = () => {
    setPin(pin.slice(0, -1))
    setErrorPin(false)
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: '#E0F7FA',
        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.07) 1.5px, transparent 0)',
        backgroundSize: '22px 22px',
      }}
    >
      <NavbarDev rol="selector" />

      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">

        {/* Título HU-11 */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B3A5C] mb-2 text-center">
          ¿Quién está jugando hoy?
        </h1>
        <p className="text-[#4A7A96] mb-10 text-center text-base">
          Selecciona para entrar al perfil del niño o accede como tutor
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-4 py-4">
          {NinosList.map((nino) => (
            <button
              key={nino.id_infante}
              onClick={() => handleSeleccionarNino(nino)}
              className="flex flex-col items-center gap-3 p-5 bg-white rounded-3xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0 min-w-[130px]"
            >
              <div className="w-20 h-20 rounded-full bg-[#E0F7FA] border-4 border-[#1B3A5C] flex items-center justify-center text-5xl">
                {nino.avatar_url}
              </div>
              <p className="font-extrabold text-[#1B3A5C] text-lg">
                {nino.nombre}
              </p>
              <p className="text-sm text-[#78909C] font-semibold">
                {calcularEdad(nino.fecha_nacimiento)}
              </p>
            </button>
          ))}
        </div>


        <button
          onClick={() => setMostrarPin(true)}
          className="mt-6 bg-blue-300 items-center gap-2 hover:bg-[#2A4F73]  px-6 py-3 rounded-full transition-all shadow-md"
        >
          <FontAwesomeIcon icon={faGear} />
          <span>Acceso de tutor</span>
        </button>

      </div>

      {mostrarPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl ${errorPin ? 'animate-shake' : ''}`}>

            <div className="bg-blue-300 rounded-full px-6 py-2 w-fit mx-auto shadow-sm mb-4">
              <h2 className="text-xl font-extrabold text-[#1B3A5C] text-center mb-1v">
                Acceso de tutor
              </h2>
            </div>
            <p className="text-sm text-[#78909C] text-center mb-6">
              Ingresa tu PIN de 4 dígitos
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full transition-all"
                  style={{
                    background: i < pin.length
                      ? errorPin ? '#E53935' : '#1B3A5C'
                      : '#CBD5E0',
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumero(String(num))}
                  className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-[#E0F7FA] active:bg-[#B2EBF2] font-extrabold text-xl text-[#1B3A5C] transition-all active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleBorrar}
                className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-red-50 font-bold text-[#E53935] transition-all active:scale-95 text-sm"
              >
                ⌫
              </button>
              <button
                onClick={() => handleNumero('0')}
                className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-[#E0F7FA] active:bg-[#B2EBF2] font-extrabold text-xl text-[#1B3A5C] transition-all active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => { setMostrarPin(false); setPin(''); setErrorPin(false) }}
                className="h-14 rounded-2xl bg-[#F0F4F8] hover:bg-red-50 font-bold text-[#78909C] transition-all active:scale-95 text-sm"
              >
                ✕
              </button>
            </div>

            {errorPin && (
              <p className="text-center text-sm text-red-500 font-semibold mt-2">
                PIN incorrecto, intenta de nuevo
              </p>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default Page1