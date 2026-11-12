import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface RutaAdminProps {
  children?: React.ReactNode;
}

export function RutaAdmin({ children }: RutaAdminProps) {
  const { estaAutenticado, esAdmin } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  if (!esAdmin) {
    return <Navigate to="/accesotutor" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default RutaAdmin;
