import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
//import { AuthProvider } from './context/AuthContext.jsx';
import { NinoProvider } from './context/NinoContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <NinoProvider>
          <App />
        </NinoProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </StrictMode>
);
