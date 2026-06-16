import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Routes, Route, Link } from "react-router"
import './App.css'
import Page1 from './Pages/Page1'
import Page2 from './Pages/Page2'

function App({name, role, imageUrl}) {

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        
        {/* NAVBAR / ENCABEZADO */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            <div className="flex items-center space-x-2">
              <img src={viteLogo} className="h-6" alt="Vite logo" />
              <span className="font-bold text-xl text-indigo-600">{name}</span>
            </div>
            
            {/* MENÚ DE NAVEGACIÓN: Corregido para apuntar a las rutas reales */}
            <nav className="flex space-x-6 font-medium text-gray-600">
              <Link to="/" className="hover:text-indigo-600 transition-colors">Inicio</Link>
              <Link to="/pagina1" className="hover:text-indigo-600 transition-colors">Página 1</Link>
              <Link to="/pagina2" className="hover:text-indigo-600 transition-colors">Página 2</Link>
            </nav>

          </div>
        </header>

        {/* CONTENEDOR DINÁMICO DE VISTAS */}
        <main className="flex-grow">
          <Routes>
            {/* Usamos Page1 como página de inicio (/) y también le damos su propia ruta.
              Nota cómo ahora los componentes del 'element' empiezan con MAYÚSCULA.
            */}
            <Route path="/" element={<Page1 />} />
            <Route path="/pagina1" element={<Page1 />} />
            <Route path="/pagina2" element={<Page2 />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-100 py-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {name}</p>
        </footer>

      </div>
    </>
  )
}

export default App
