import { Routes, Route } from "react-router";
import Login from './Pages/Login'; // CAMBIO: Sin llaves

function App() {
  const handleLogin = (role) => {
    console.log("Sesión iniciada como:", role);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} /> {/* CAMBIO: Login en lugar de LoginScreen */}
    </Routes>
  );
}

export default App;