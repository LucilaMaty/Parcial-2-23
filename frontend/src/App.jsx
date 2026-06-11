import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import MisPedidos from './pages/MisPedidos';
import AdminPanel from './pages/AdminPanel'; // 1. IMPORTAMOS LA PANTALLA REAL DEL ADMIN
import FormularioPedido from './pages/FormularioPedido';
import DetallePedido from './pages/DetallePedido';
import NotFound from './pages/NotFound';

// Último componente temporal que nos queda (el inicio)
const VistaInicio = () => <h2>🏠 Pantalla de Bienvenida (Pública)</h2>;

function App() {
  const { autenticado, usuario, logoutGlobal, cargando } = useAuth();

  if (cargando) return <h2>Verificando sistema de seguridad...</h2>;

  return (
    <BrowserRouter>
      <div className="container mt-4" style={{ fontFamily: 'sans-serif' }}>
        
        {/* BARRA DE NAVEGACIÓN */}
        <nav className="navbar navbar-expand navbar-light bg-light p-3 rounded mb-4 border">
          <div className="container-fluid justify-content-between">
            <div className="navbar-nav align-items-center">
              <span className="navbar-brand mb-0 h1 text-primary" style={{ fontSize: '1.2rem' }}>🍕 Buffet App</span>
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/nuevo-pedido" className="nav-link">Nuevo Pedido</Link>
              <Link to="/mis-pedidos" className="nav-link">Mis Pedidos</Link>
              <Link to="/admin" className="nav-link">Panel Admin</Link>
            </div>

            {autenticado && (
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-success py-2 px-3 fs-6">👤 {usuario?.nombre}</span>
                <button onClick={logoutGlobal} className="btn btn-sm btn-danger">
                  Salir
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* ENRUTADOR */}
        <Routes>
          <Route path="/" element={<VistaInicio />} />
          <Route path="/login" element={<Login />} />

          <Route 
            path="/mis-pedidos" 
            element={
              <ProtectedRoute>
                <MisPedidos />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/nuevo-pedido" 
            element={
              <ProtectedRoute>
                <FormularioPedido />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/editar-pedido/:id" 
            element={
              <ProtectedRoute>
                <FormularioPedido />
              </ProtectedRoute>
            } 
          />

          {/* 2. ENLAZAMOS LA PANTALLA ADMINISTRATIVA PROTEGIDA POR ROL */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute rolRequerido="admin">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/detalle-pedido/:id" 
            element={
              <ProtectedRoute rolRequerido={usuario?.rol}> 
                <DetallePedido />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;