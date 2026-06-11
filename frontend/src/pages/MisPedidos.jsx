// src/pages/MisPedidos.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import pedidosService from '../services/pedidosService';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [menus, setMenus] = useState([]);
  const [filtros, setFiltros] = useState({ fecha: '', estado: '', menu: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Usamos useCallback para no recrear la función en cada renderizado
  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Limpiamos los filtros vacíos antes de enviar la petición
      const filtrosActivos = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '')
      );
      
      // Cargamos la lista de menús para el filtro si aún no la tenemos
      if (menus.length === 0) {
        const dataMenus = await pedidosService.obtenerMenusDisponibles();
        setMenus(dataMenus);
      }

      const data = await pedidosService.obtenerMisPedidos(filtrosActivos);
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const handleCancelar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        await pedidosService.cancelarPedido(id);
        cargarPedidos(); // Recargar la lista tras cancelar
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleChangeFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Mis Pedidos</h2>
        <Link to="/nuevo-pedido" className="btn btn-primary fw-bold">
          + Nuevo Pedido
        </Link>
      </div>

      {/* SECCIÓN DE FILTROS */}
      <div className="card shadow-sm mb-4 border-0 bg-light">
        <div className="card-body">
          <h5 className="card-title mb-3">🔍 Filtrar Búsqueda</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Fecha</label>
              <input 
                type="date" 
                className="form-control" 
                name="fecha"
                value={filtros.fecha}
                onChange={handleChangeFiltro}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Estado</label>
              <select 
                className="form-select" 
                name="estado"
                value={filtros.estado}
                onChange={handleChangeFiltro}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Menú</label>
              <select 
                className="form-select" 
                name="menu"
                value={filtros.menu}
                onChange={handleChangeFiltro}
              >
                <option value="">Todos los platos</option>
                {menus.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100" 
                onClick={() => setFiltros({ fecha: '', estado: '', menu: '' })}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE PEDIDOS */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : pedidos.length === 0 ? (
        <div className="alert alert-info text-center">No se encontraron pedidos con esos filtros.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Menú</th>
                <th>Cant.</th>
                <th>Turno / Lugar</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.id}</td>
                  <td>{p.fecha}</td>
                  <td>{p.menu?.nombre || 'Menú no disponible'}</td>
                  <td>{p.cantidad}</td>
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
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to={`/detalle-pedido/${p.id}`} className="btn btn-sm btn-outline-info">Ver</Link>
                      {/* El Patovica Visual: Solo mostramos editar/cancelar si no está entregado o cancelado */}
                      {(p.estado !== 'entregado' && p.estado !== 'cancelado') && (
                        <>
                          <Link 
                            to={`/editar-pedido/${p.id}`} 
                            className={`btn btn-sm btn-outline-primary ${p.estado !== 'pendiente' ? 'disabled' : ''}`}
                          >
                            Editar
                          </Link>
                          <button onClick={() => handleCancelar(p.id)} className="btn btn-sm btn-outline-danger">Cancelar</button>
                        </>
                      )}
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

export default MisPedidos;