// src/pages/AdminPanel.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import pedidosService from '../services/pedidosService';

const AdminPanel = () => {
  const [pedidos, setPedidos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [menus, setMenus] = useState([]);
  const [filtros, setFiltros] = useState({ fecha: '', estado: '', menu: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDatosAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // 1. Cargamos el resumen estadístico
      const dataResumen = await pedidosService.obtenerResumenAdmin();
      setResumen(dataResumen);

      // Cargamos la lista de menús para el filtro si aún no la tenemos
      if (menus.length === 0) {
        const dataMenus = await pedidosService.obtenerMenusDisponibles();
        setMenus(dataMenus);
      }

      // 2. Cargamos el listado filtrado
      const filtrosActivos = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '')
      );
      const data = await pedidosService.obtenerMisPedidos(filtrosActivos);
      setPedidos(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarDatosAdmin();
  }, [cargarDatosAdmin]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosService.cambiarEstadoAdmin(id, nuevoEstado);
      cargarDatosAdmin(); // Recargamos todo para actualizar números y tabla
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

      {/* 📊 SECCIÓN DE RESUMEN (KPIs) */}
      {resumen && (
        <div className="row g-3 mb-4 text-center">
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-primary text-white p-3">
              <small className="fw-bold opacity-75">Total Pedidos</small>
              <h3 className="mb-0">{resumen.totalPedidos}</h3>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-success text-white p-3">
              <small className="fw-bold opacity-75">Recaudación Total</small>
              <h3 className="mb-0">${resumen.recaudacionTotal.toLocaleString()}</h3>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-warning text-dark p-3">
              <small className="fw-bold opacity-75">Pendientes</small>
              <h3 className="mb-0">{resumen.porEstado.pendiente}</h3>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-info text-white p-3">
              <small className="fw-bold opacity-75">Confirmados</small>
              <h3 className="mb-0">{resumen.porEstado.confirmado}</h3>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-secondary text-white p-3">
              <small className="fw-bold opacity-75">Entregados</small>
              <h3 className="mb-0">{resumen.porEstado.entregado}</h3>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm bg-danger text-white p-3">
              <small className="fw-bold opacity-75">Cancelados</small>
              <h3 className="mb-0">{resumen.porEstado.cancelado}</h3>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN DE FILTROS (Igual que el usuario, pero filtra globalmente) */}
      <div className="card shadow-sm mb-4 border-0 bg-light">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Filtrar por Fecha</label>
              <input type="date" className="form-control" name="fecha" value={filtros.fecha} onChange={handleChangeFiltro} />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Filtrar por Estado</label>
              <select className="form-select" name="estado" value={filtros.estado} onChange={handleChangeFiltro}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">Filtrar por Menú</label>
              <select className="form-select" name="menu" value={filtros.menu} onChange={handleChangeFiltro}>
                <option value="">Todos los platos</option>
                {menus.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-outline-dark w-100" onClick={() => setFiltros({ fecha: '', estado: '', menu: '' })}>Limpiar</button>
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
                <th>Turno / Lugar</th>
                <th>Total</th>
                <th>Estado Actual</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.id}</td>
                  <td>{p.usuario?.nombre || `ID: ${p.usuarioId}`}</td>
                  <td>{p.menu?.nombre}</td>
                  <td>
                    <span className="text-capitalize">{p.turnoEntrega}</span><br />
                    <small className="text-muted">{p.puntoRetiro}</small>
                  </td>
                  <td>${p.total}</td>
                  <td>
                    <span className={`badge bg-${p.estado === 'entregado' ? 'success' : p.estado === 'cancelado' ? 'danger' : p.estado === 'confirmado' ? 'info' : 'warning text-dark'}`}>
                      {p.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center align-items-center">
                      <Link to={`/detalle-pedido/${p.id}`} className="btn btn-sm btn-outline-info">Ver</Link>
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
                    </div>
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