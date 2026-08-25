//import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { AuthProvider } from './context/AuthContext';
import { NinoProvider } from './context/NinoContext';

function App() {

  return (
    <AuthProvider>
      <NinoProvider>
        <div className="min-h-screen flex flex-col justify-between bg-gray-50">
          <main>
            <AppRoutes />
          </main>
        </div>
      </NinoProvider>
    </AuthProvider>
  )
}

export default App
