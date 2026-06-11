import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente va a envolver a las pantallas privadas
export const ProtectedRoute = ({ children, rolRequerido }) => {
  const { autenticado, usuario, cargando } = useAuth();

  // Si el contexto todavía está leyendo el localStorage, esperamos un milisegundo
  if (cargando) return <h2>Verificando credenciales...</h2>;

  // CANDADO 1: Si no está logueado, directo al Login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // CANDADO 2: Si la ruta pide un rol específico (ej: admin) y el usuario no lo tiene
  if (rolRequerido && usuario?.rol !== rolRequerido && usuario?.role !== rolRequerido) {
    // Lo mandamos a la raíz o a una pantalla de acceso denegado
    return <Navigate to="/" replace />;
  }

  // Si pasó todos los candados, lo dejamos pasar al componente real (children)
  return children;
};