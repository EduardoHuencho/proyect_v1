import { Routes, Route, Navigate } from 'react-router';
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
import EditarPictograma from '../Pages/EditarPictograma';
import HorarioTutor from '../Pages/HorarioTutor';
import HorarioNino from '../Pages/HorarioNino';
import RutaProtegida from './RutaProtegida';
import JuegoQueEs from '../Pages/JuegoQueEs';
import ProgresoInfante from '../Pages/ProgresoInfante';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<RutaProtegida />}>
        <Route path="/accesotutor" element={<AccesoTutor />} />
        <Route path="/menumodulos" element={<MenuModulos />} />
        <Route path="/paneltutor" element={<PanelTutor />} />
        <Route path="/dashboardtutor" element={<DashboardTutor />} />
        <Route path="/pictogramas" element={<Pictogramas />} />
        <Route path="/menujuegos" element={<MenuJuegos />} />
        <Route path="/crearnino" element={<CrearNino key="crear" />} />
        <Route path="/editarnino/:id" element={<CrearNino key="editar" />} />
        <Route path="/crearpictograma" element={<CrearPictograma />} />
        <Route path="/editarpictograma/:id" element={<EditarPictograma />} />
        <Route path="/horariotutor" element={<HorarioTutor />} />
        <Route path="/horarionino" element={<HorarioNino />} />
        <Route path="/juegoquees" element={<JuegoQueEs />} />
        <Route path="/progresoinfante" element={<ProgresoInfante />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default AppRoutes;
