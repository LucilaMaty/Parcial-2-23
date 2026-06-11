/* eslint-disable */

import { useState, useEffect } from 'react';
import pedidosService from '../services/pedidosService';

const AdminPanel = () => {
  const [todosLosPedidos, setTodosLosPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorAdmin, setErrorAdmin] = useState('');
  
  // Estado para filtrar la vista del admin de forma rápida
  const [filtroEstado, setFiltroEstado] = useState('');

  // Función para traer los pedidos de toda la facultad
  const cargarPedidosGlobales = async () => {
    try {
      setCargando(true);
      setErrorAdmin('');
      
      // Si el admin elige un estado en el select, se lo pasamos como filtro al servicio
      const filtros = filtroEstado ? { estado: filtroEstado } : {};
      const datos = await pedidosService.obtenerMisPedidos(filtros);
      
      setTodosLosPedidos(datos);
    } catch (error) {
      setErrorAdmin(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Disparador automático al cargar la pantalla o cambiar el selector de filtro
  useEffect(() => {
    cargarPedidosGlobales();
  }, [filtroEstado]); // Cada vez que cambie 'filtroEstado', se vuelve a ejecutar

  // Función para avanzar el pedido en su ciclo de vida
  const modificarEstado = async (id, estadoSiguiente) => {
    try {
      await pedidosService.cambiarEstadoAdmin(id, estadoSiguiente);
      alert(`Pedido #${id} actualizado a ${estadoSiguiente} con éxito.`);
      cargarPedidosGlobales(); // Refrescamos la lista para ver el cambio reflejado
    } catch (error) {
      alert(`Error al cambiar estado: ${error.message}`);
    }
  };

  return (
    <div className="card shadow-sm mt-4 border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">👑 Panel de Control - Administración del Buffet</h4>
        <span className="badge bg-light text-primary fw-bold">Modo Administrador</span>
      </div>
      <div className="card-body">
        
        {/* BARRA DE FILTRADO RÁPIDO */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded border">
          <div>
            <h5 className="mb-0 text-muted">Gestión de Viandas Diarias</h5>
            <small className="text-secondary">Monitoreo global de stock y estados</small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <label className="text-nowrap mb-0 small text-muted">Filtrar por:</label>
            <select 
              className="form-select form-select-sm" 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="">Todos los pedidos</option>
              <option value="pendiente">Pendientes ⏳</option>
              <option value="confirmado">Confirmados ✅</option>
              <option value="entregado">Entregados 📦</option>
              <option value="cancelado">Cancelados ❌</option>
            </select>
          </div>
        </div>

        {errorAdmin && <div className="alert alert-danger">{errorAdmin}</div>}

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Cargando base de datos global...</p>
          </div>
        ) : todosLosPedidos.length === 0 ? (
          <p className="text-center text-muted py-4">No hay pedidos registrados en este estado.</p>
        ) : (
          /* TABLA DE GESTIÓN ADMINISTRATIVA */
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th># ID</th>
                  <th>Usuario (Cliente)</th>
                  <th>Menú Solicitado</th>
                  <th>Cant.</th>
                  <th>Total</th>
                  <th>Estado Actual</th>
                  <th className="text-center">Acciones de Gestión</th>
                </tr>
              </thead>
              <tbody>
                {todosLosPedidos.map((p) => (
                  <tr key={p.id}>
                    <td><strong>#{p.id}</strong></td>
                    {/* Mostramos el usuarioId o el nombre si tu include de Sequelize lo trae */}
                    <td><span className="text-secondary">👤 Usuario ID: {p.usuarioId}</span></td>
                    <td>
                      <span className="fw-bold">{p.Menu?.nombre || `Menú #${p.menuId}`}</span>
                      <div className="text-muted small">🕒 {p.turnoEntrega} - {p.puntoRetiro}</div>
                    </td>
                    <td>{p.cantidad}</td>
                    <td className="fw-bold text-dark">${p.total}</td>
                    <td>
                      <span className={`badge bg-${
                        p.estado === 'pendiente' ? 'warning text-dark' :
                        p.estado === 'confirmado' ? 'info' :
                        p.estado === 'entregado' ? 'success' : 'danger'
                      }`}>
                        {p.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        
                        {/* Botón para Confirmar: Solo si está Pendiente */}
                        <button
                          className="btn btn-success"
                          disabled={p.estado !== 'pendiente'}
                          onClick={() => modificarEstado(p.id, 'confirmado')}
                        >
                          👍 Confirmar
                        </button>

                        {/* Botón para Entregar: Solo si ya está Confirmado */}
                        <button
                          className="btn btn-primary"
                          disabled={p.estado !== 'confirmado'}
                          onClick={() => modificarEstado(p.id, 'entregado')}
                        >
                          🚚 Entregar
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;