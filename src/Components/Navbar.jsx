import React from 'react'
import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="bg-white border-b p-4 flex gap-4">
      <Link to="/" className="text-blue-600 hover:underline">Log</Link>
      <Link to="/page1" className="text-blue-600 hover:underline">Tutor</Link>
      <Link to="/page2" className="text-blue-600 hover:underline">Niños</Link>
      <Link to="/pictogramas" className="text-blue-600 hover:underline">Pictogramas</Link>
    </nav>
  )
}

export default Navbar