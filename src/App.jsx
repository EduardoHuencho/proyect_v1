//import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { AuthProvider } from './context/AuthContext';
import { NinoProvider } from './context/NinoContext';
import { PictogramaProvider } from './context/PictogramasContext';

function App() {

  return (
    <AuthProvider>
      <NinoProvider>
        <PictogramaProvider>
          <div className="min-h-screen flex flex-col justify-between bg-gray-50">
            <main>
              <AppRoutes />
            </main>
          </div>
        </PictogramaProvider>
      </NinoProvider>
    </AuthProvider>
  )
}

export default App
