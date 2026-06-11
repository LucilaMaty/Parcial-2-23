/* eslint-disable */

import { useState, useEffect } from 'react';
import pedidosService from '../services/pedidosService';

const MisPedidos = () => {
  // 1. ESTADOS LOCALES
  const [pedidos, setPedidos] = useState([]);
  const [errorPage, setErrorPage] = useState('');
  const [cargando, setCargando] = useState(true);

  // Estados para los Filtros Combinables (Punto 3)
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  // 2. FUNCIÓN PARA CARGAR PEDIDOS DESDE EL BACKEND
  const cargarPedidos = async () => {
    try {
      setErrorPage('');
      setCargando(true);

      // Armamos el objeto con los filtros dinámicos (solo mandamos los que el usuario completó)
      const queryParams = {};
      if (estadoFiltro) queryParams.estado = estadoFiltro;
      if (tipoFiltro) queryParams.tipo = tipoFiltro;
      if (fechaFiltro) queryParams.fecha = fechaFiltro;

      // Le pedimos al mozo de pedidos que traiga la info aplicando los filtros
      const datos = await pedidosService.obtenerMisPedidos(queryParams);
      setPedidos(datos);
    } catch (error) {
      setErrorPage(error.message);
    } finally {
      setCargando(false);
    }
  };

  // DISPARADOR AUTOMÁTICO: Corre la primera vez que se abre la pantalla
  useEffect(() => {
    cargarPedidos();
  }, []); // El array vacío significa: "Ejecutá solo al montar el componente"

  // 3. ACCIÓN: CANCELAR PEDIDO (Punto 7 del parcial)
  const manejarCancelar = async (id) => {
    if (!window.confirm(`¿Estás seguro de que querés cancelar el pedido #${id}?`)) return;

    try {
      await pedidosService.cancelarPedido(id);
      alert('¡Pedido cancelado correctamente!');
      cargarPedidos(); // ¡REFRESCAR LA MESA! Volvemos a pedir los datos actualizados
    } catch (error) {
      alert(`Error al cancelar: ${error.message}`);
    }
  };

  // 4. ACCIÓN: EDITAR PEDIDO (Punto 6 del parcial)
  // Para hacerlo rápido y dinámico en el examen, usamos un prompt flotante para pedir cantidad
  const manejarEditar = async (id, cantidadActual, observacionesActuales) => {
    const nuevaCantidad = window.prompt(`Modificar cantidad para pedido #${id}:`, cantidadActual);
    if (nuevaCantidad === null) return; // Si cancela el prompt, no hace nada

    const numCantidad = parseInt(nuevaCantidad);
    if (isNaN(numCantidad) || numCantidad <= 0) {
      return alert('Por favor, ingresá una cantidad válida mayor a 0');
    }

    const nuevasObservaciones = window.prompt('Modificar observaciones:', observacionesActuales);

    try {
      // Mandamos los nuevos datos al backend mediante PUT
      await pedidosService.editarPedido(id, {
        cantidad: numCantidad,
        observaciones: nuevasObservaciones
      });
      alert('¡Pedido modificado con éxito!');
      cargarPedidos(); // ¡REFRESCAR LA MESA!
    } catch (error) {
      alert(`Error al modificar: ${error.message}`);
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">📦 Mi Historial de Pedidos</h4>
        <button className="btn btn-sm btn-outline-light" onClick={cargarPedidos}>🔄 Recargar</button>
      </div>
      <div className="card-body">

        {/* SECCIÓN DE FILTROS COMBINABLES (Punto 3) */}
        <div className="row g-3 mb-4 p-3 bg-light rounded border">
          <h5>🔍 Filtros de Búsqueda</h5>
          
          {/* Filtro por Estado */}
          <div className="col-md-3">
            <label className="form-label text-muted small">Estado</label>
            <select className="form-select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Filtro por Tipo de Menú */}
          <div className="col-md-3">
            <label className="form-label text-muted small">Tipo de Menú</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: sin tacc, vegano"
              value={tipoFiltro} 
              onChange={(e) => setTipoFiltro(e.target.value)} 
            />
          </div>

          {/* Filtro por Fecha */}
          <div className="col-md-3">
            <label className="form-label text-muted small">Fecha de Entrega</label>
            <input 
              type="date" 
              className="form-control" 
              value={fechaFiltro} 
              onChange={(e) => setFechaFiltro(e.target.value)} 
            />
          </div>

          {/* Botón para Aplicar Filtros */}
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={cargarPedidos}>
              Aplicar Filtros combinados
            </button>
          </div>
        </div>

        {/* MANEJO DE ERRORES Y CARGA */}
        {errorPage && <div className="alert alert-danger">{errorPage}</div>}
        
        {cargando ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Consultando historial en la cocina...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-muted py-4">No se encontraron pedidos con los filtros aplicados.</p>
        ) : (
          /* TABLA DE RESULTADOS REALES CON BOOTSTRAP */
          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-secondary">
                <tr>
                  <th># ID</th>
                  <th>Menú</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Turno/Lugar</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* ESTAMPADORA DINÁMICA CON .MAP() */}
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td><strong>#{p.id}</strong></td>
                    <td>
                      {p.Menu?.nombre || `Menú ID: ${p.menuId}`}
                      {p.observaciones && <div className="text-muted small">💬 {p.observaciones}</div>}
                    </td>
                    <td>{p.cantidad} unidades</td>
                    <td className="text-success fw-bold">${p.total}</td>
                    <td>
                      <span className="badge bg-light text-dark border me-1">{p.turnoEntrega}</span>
                      <small className="text-muted">{p.puntoRetiro}</small>
                    </td>
                    <td>
                      {/* Badge dinámico según el estado */}
                      <span className={`badge bg-${
                        p.estado === 'pendiente' ? 'warning text-dark' :
                        p.estado === 'confirmado' ? 'info' :
                        p.estado === 'entregado' ? 'success' : 'danger'
                      }`}>
                        {p.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      {/* BOTONES DE ACCIÓN EXIGIDOS POR EL PARCIAL */}
                      <div className="btn-group btn-group-sm">
                        
                        {/* Botón Editar: Solo si está en estado 'pendiente' */}
                        <button 
                          className="btn btn-outline-primary"
                          disabled={p.estado !== 'pendiente'}
                          onClick={() => manejarEditar(p.id, p.cantidad, p.observaciones)}
                          title="Modificar pedido"
                        >
                          ✏️ Editar
                        </button>

                        {/* Botón Cancelar: Solo si NO está entregado ni cancelado */}
                        <button 
                          className="btn btn-outline-danger"
                          disabled={p.estado === 'cancelado' || p.estado === 'entregado'}
                          onClick={() => manejarCancelar(p.id)}
                          title="Dar de baja"
                        >
                          ❌ Cancelar
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

export default MisPedidos;