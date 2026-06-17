import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Routes, Route, Link } from "react-router"
import './App.css'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import AppRoutes from './Routes/AppRoutes'

function App({name, role, imageUrl}) {

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <AppRoutes />
      </main>
    
      </div>
    </>
  )
}

export default App
