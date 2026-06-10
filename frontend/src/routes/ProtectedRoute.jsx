import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ rolesPermitidos }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    // Si no está autenticado, rebota al login
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    // Si su rol no tiene permiso, lo manda a la raíz pública
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza la ruta correspondiente
  return <Outlet />;
};

export default ProtectedRoute;