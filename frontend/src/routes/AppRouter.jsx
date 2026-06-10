import { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

// Simulación de la Pantalla Principal requerida para probar
const DashboardDummy = () => {
  const { usuario, logoutUser } = useContext(AuthContext);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenido, {usuario.nombre}</h1>
      <p>Rol asignado en backend: <strong>{usuario.rol}</strong></p>
      <button onClick={logoutUser} style={{ padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Register />} />

      {/* Rutas Protegidas de la Aplicación */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardDummy />} />
        {/* Aquí irán más adelante tus rutas de pedidos y administración */}
      </Route>

      {/* Ruta Comodín (*) - Obligatoria según el enunciado */}
      <Route path="*" element={
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>404 - Página No Encontrada</h2>
          <p>La sección buscada no existe.</p>
          <Link to="/">Volver al Inicio</Link>
        </div>
      } />
    </Routes>
  );
};

export default AppRouter;