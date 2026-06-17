import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import NinosList from '../Data/Ninos.json'

const modulos = [
  {
    id: 'calendario',
    titulo: 'Calendario Semanal',
    descripcion: 'Gestiona el horario de la semana',
    emoji: '📅',
    color: 'bg-[#1B3A5C]',
    disponible: false,
  },
  {
    id: 'pictogramas',
    titulo: 'Pictogramas',
    descripcion: 'Constructor de frases AAC',
    emoji: '🖼️',
    color: 'bg-[#1A7A6E]',
    disponible: true,
    ruta: '/pictogramas',
  },
  {
    id: 'juegos',
    titulo: 'Juegos',
    descripcion: '¿Qué Es? y Cuentitos',
    emoji: '🎲',
    color: 'bg-[#6B3FA0]',
    disponible: false,
  },
  {
    id: 'analisis',
    titulo: 'Análisis de Progreso',
    descripcion: 'Estadísticas y categorías débiles',
    emoji: '📊',
    color: 'bg-[#C0440A]',
    disponible: false,
  },
]

function Page1() {
  const [ninoSeleccionado, setNinoSeleccionado] = useState(NinosList[0])
  const navigate = useNavigate()

  const handleModulo = (modulo) => {
    if (!modulo.disponible) return
    navigate(modulo.ruta)
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: '#E0F7FA',
        backgroundImage:
          'radial-gradient(circle at 1.5px 1.5px, rgba(0,80,136,0.07) 1.5px, transparent 0)',
        backgroundSize: '22px 22px',
      }}
    >
      <nav className="bg-[#1B3A5C] px-6 py-3 flex items-center justify-between">
        <span className="font-extrabold text-xl tracking-wide">
          <span style={{ color: '#E53935' }}>T</span>
          <span style={{ color: '#43A047' }}>E</span>
          <span style={{ color: '#FDD835' }}>A</span>
          <span style={{ color: '#1E88E5' }}>Y</span>
          <span style={{ color: '#E53935' }}>U</span>
          <span style={{ color: '#43A047' }}>D</span>
          <span style={{ color: '#FDD835' }}>O</span>
        </span>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-[#2A4F73] text-white px-4 py-2 rounded-xl text-sm font-semibold">
            <span>👩‍🏫</span>
            <span>Tutor</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#2A4F73] hover:bg-[#3A6F9F] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <span>🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-xs font-bold text-gray-400 tracking-widest mb-4 uppercase">
            Seleccionar Niño/a
          </p>
          <div className="flex flex-wrap gap-3">
            {NinosList.map((nino) => (
              <button
                key={nino.id}
                onClick={() => setNinoSeleccionado(nino)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: ninoSeleccionado.id === nino.id ? '#1B3A5C' : 'transparent',
                  color: ninoSeleccionado.id === nino.id ? 'white' : '#1B3A5C',
                  border: '2px solid',
                  borderColor: ninoSeleccionado.id === nino.id ? '#1B3A5C' : '#CBD5E0',
                }}
              >
                <span>{nino.emoji}</span>
                <span>{nino.nombre}</span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: ninoSeleccionado.id === nino.id ? '#FDD835' : '#94A3B8',
                  }}
                >
                  {nino.edad}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1B3A5C]">
            ¡Bienvenido/a! 👋
          </h1>
          <p className="text-[#4A7A96] mt-1">¿Qué quieres gestionar hoy?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {modulos.map((modulo) => (
            <button
              key={modulo.id}
              onClick={() => handleModulo(modulo)}
              className={`${modulo.color} rounded-2xl p-6 text-left transition-all
                ${modulo.disponible
                  ? 'hover:scale-105 active:scale-95 cursor-pointer opacity-100'
                  : 'opacity-70 cursor-not-allowed'
                }`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                {modulo.emoji}
              </div>
              <h2 className="text-white font-extrabold text-lg">
                {modulo.titulo}
              </h2>
              <p
                className="text-sm mt-1 font-medium"
                style={{
                  color: modulo.disponible ? '#FDD835' : 'rgba(255,255,255,0.7)',
                }}
              >
                {modulo.disponible ? modulo.descripcion : 'Próximamente'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 py-6">
        TEAYUDO · Sistema educativo AAC
      </p>
    </div>
  )
}

export default Page1