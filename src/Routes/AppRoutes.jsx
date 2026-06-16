import React from 'react'
import { Routes, Route } from 'react-router'
import Page1 from '../Pages/Page1'
import Page2 from '../Pages/Page2'
import Pictogramas from '../Pages/Pictogramas'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/pictogramas" element={<Pictogramas />} />
    </Routes>
  )
}

export default AppRoutes