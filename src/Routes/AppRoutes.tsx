import { Routes, Route } from 'react-router';
import Login from '../Pages/Login';
import AccesoTutor from '../Pages/AccesoTutor';
import MenuModulos from '../Pages/MenuModulos';
import PanelTutor from '../Pages/PanelTutor';
import DashboardTutor from '../Pages/DashboardTutor';
import Pictogramas from '../Pages/Pictogramas';
import MenuJuegos from '../Pages/MenuJuegos';
import Registro from '../Pages/Registro';
import CrearNino from '../Pages/CrearNino';
import CrearPictograma from '../Pages/CrearPictograma';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* crear ward con if */}
      <Route path="/accesotutor" element={<AccesoTutor />} />
      <Route path="/menumodulos" element={<MenuModulos />} />
      <Route path="/paneltutor" element={<PanelTutor />} />
      <Route path="/dashboardtutor" element={<DashboardTutor />} />
      <Route path="/pictogramas" element={<Pictogramas />} />
      <Route path="/menujuegos" element={<MenuJuegos />} />
      <Route path="/registro" element={<Registro />} />
      {/*
      <Route path="/crearnino" element={<CrearNino />} />
      */}
      <Route path="/crearnino" element={<CrearNino key="crear" />} />
      <Route path="/editarnino/:id" element={<CrearNino key="editar" />} />
      <Route path="/crearpictograma" element={<CrearPictograma />} />
    </Routes>
  );
}
export default AppRoutes;