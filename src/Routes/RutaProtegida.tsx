import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface RutaProtegidaProps {
  children?: React.ReactNode;
}

export function RutaProtegida({ children }: RutaProtegidaProps) {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default RutaProtegida;

