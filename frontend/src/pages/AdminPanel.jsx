// src/pages/AdminPanel.jsx
import { useState, useEffect, useCallback } from 'react';
import pedidosService from '../services/pedidosService';

const AdminPanel = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtros, setFiltros] = useState({ fecha: '', estado: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarPedidosAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const filtrosActivos = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '')
      );
      
      // Reutilizamos el mismo endpoint. Como el backend detecta el token de 'admin',
      // devolverá todos los pedidos sin aislar por ID de usuario.
      const data = await pedidosService.obtenerMisPedidos(filtrosActivos);
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarPedidosAdmin();
  }, [cargarPedidosAdmin]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosService.cambiarEstadoAdmin(id, nuevoEstado);
      cargarPedidosAdmin(); // Recargamos para ver los cambios
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangeFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <div className="mb-4 bg-danger text-white p-3 rounded shadow-sm d-flex justify-content-between align-items-center">
        <h2 className="mb-0">🛡️ Panel de Control Administrador</h2>
        <span className="badge bg-light text-danger fs-6">Nivel: SUPERVISOR</span>
      </div>

      {/* SECCIÓN DE FILTROS (Igual que el usuario, pero filtra globalmente) */}
      <div className="card shadow-sm mb-4 border-0 bg-light">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold">Filtrar por Fecha</label>
              <input type="date" className="form-control" name="fecha" value={filtros.fecha} onChange={handleChangeFiltro} />
            </div>
            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold">Filtrar por Estado</label>
              <select className="form-select" name="estado" value={filtros.estado} onChange={handleChangeFiltro}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-outline-dark w-100" onClick={() => setFiltros({ fecha: '', estado: '' })}>Limpiar</button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
      ) : pedidos.length === 0 ? (
        <div className="alert alert-info text-center">No hay pedidos registrados en el sistema.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Menú</th>
                <th>Total</th>
                <th>Estado Actual</th>
                <th className="text-center">Cambiar Estado (Circuito)</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.id}</td>
                  <td>{p.usuarioId}</td> {/* Muestra el ID de quién pidió. Si tenías un include de Usuario, puedes poner p.usuario.nombre */}
                  <td>{p.menu?.nombre}</td>
                  <td>${p.total}</td>
                  <td>
                    <span className={`badge bg-${p.estado === 'entregado' ? 'success' : p.estado === 'cancelado' ? 'danger' : p.estado === 'confirmado' ? 'info' : 'warning text-dark'}`}>
                      {p.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center">
                    <select 
                      className="form-select form-select-sm d-inline-block w-auto"
                      value={p.estado}
                      onChange={(e) => handleCambiarEstado(p.id, e.target.value)}
                      disabled={p.estado === 'entregado' || p.estado === 'cancelado'}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;