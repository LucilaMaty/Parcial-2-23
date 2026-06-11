/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import pedidosService from '../services/pedidosService';

const DetallePedido = () => {
  // 1. LEEMOS EL ID DE LA URL USANDO USEPARAMS
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados locales para la gestión visual
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorDetalle, setErrorDetalle] = useState('');

  // Cargar la información del pedido al entrar
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true);
        setErrorDetalle('');
        const datos = await pedidosService.obtenerPedidoPorId(id);
        setPedido(datos);
      } catch (error) {
        setErrorDetalle(error.message);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Abriendo expediente del pedido #{id}...</p>
      </div>
    );
  }

  if (errorDetalle) {
    return (
      <div className="alert alert-danger mt-4 p-4 text-center">
        <h4>⚠️ Error al recuperar el recurso</h4>
        <p>{errorDetalle}</p>
        <Link to="/mis-pedidos" className="btn btn-outline-danger btn-sm mt-2">Volver al Historial</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Botón para retroceder */}
      <button className="btn btn-sm btn-secondary mb-3" onClick={() => navigate(-1)}>
        ⬅️ Volver Atrás
      </button>

      <div className="row g-4">
        {/* COLUMNA IZQUIERDA: TARJETA PRINCIPAL DEL PEDIDO (Punto 3) */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">📄 Detalle Estricto del Pedido</h5>
              <span className="badge bg-light text-dark fs-6">#{pedido.id}</span>
            </div>
            <div className="card-body p-4">
              <h4 className="text-primary mb-3">🛒 {pedido.Menu?.nombre || `Menú ID: ${pedido.menuId}`}</h4>
              
              <div className="row bg-light p-3 rounded mb-3 border">
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Cantidad Solicitada</small>
                  <strong>{pedido.cantidad} unidades</strong>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Importe Total Facturado</small>
                  <strong className="text-success fs-5">${pedido.total}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Turno de Entrega</small>
                  <span className="badge bg-secondary">{pedido.turnoEntrega}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Punto de Retiro</small>
                  <span className="text-dark small fw-bold">{pedido.puntoRetiro}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Observaciones del Alumno</label>
                <div className="p-2 bg-white rounded border text-secondary small">
                  {pedido.observaciones || "💬 Sin aclaraciones particulares por el cliente."}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <div>
                  <small className="text-muted d-block">Estado Operativo Actual</small>
                  <span className={`badge px-3 py-2 fs-6 bg-${
                    pedido.estado === 'pendiente' ? 'warning text-dark' :
                    pedido.estado === 'confirmado' ? 'info' :
                    pedido.estado === 'entregado' ? 'success' : 'danger'
                  }`}>
                    {pedido.estado.toUpperCase()}
                  </span>
                </div>
                <small className="text-muted text-end">
                  Fecha de Carga:<br />
                  {new Date(pedido.createdAt || pedido.fecha).toLocaleDateString('es-AR')}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE CAMBIOS INTERNO (Punto 7) */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-secondary text-white py-3">
              <h5 className="mb-0">⏱️ Historial de Estados (Auditoría)</h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4">Línea de tiempo del ciclo de vida de la vianda:</p>
              
              {/* TIMELINE DE BOOTSTRAP */}
              <div className="position-relative ps-4 border-start border-2 border-secondary" style={{ marginLeft: '10px' }}>
                
                {/* Hito 1: Creación (Siempre ocurrió) */}
                <div className="mb-4 position-relative">
                  <div className="position-absolute bg-success rounded-circle" style={{ width: '12px', height: '12px', left: '-32px', top: '5px' }}></div>
                  <h6 className="mb-0 text-success">📦 Pedido Registrado</h6>
                  <small className="text-muted">El alumno confirmó el pedido en el sistema.</small>
                </div>

                {/* Hito 2: Confirmación */}
                <div className="mb-4 position-relative">
                  <div className={`position-absolute rounded-circle ${
                    pedido.estado === 'confirmado' || pedido.estado === 'entregado' ? 'bg-info' : 'bg-light border border-secondary'
                  }`} style={{ width: '12px', height: '12px', left: '-32px', top: '5px' }}></div>
                  <h6 className={`mb-0 ${pedido.estado === 'confirmado' || pedido.estado === 'entregado' ? 'text-info' : 'text-muted'}`}>
                    👍 Confirmado por Administración
                  </h6>
                  <small className="text-muted">El buffet procesó el stock y agendó la vianda.</small>
                </div>

                {/* Hito 3: Cancelado (Solo si aplica) */}
                {pedido.estado === 'cancelado' && (
                  <div className="mb-4 position-relative">
                    <div className="position-absolute bg-danger rounded-circle" style={{ width: '12px', height: '12px', left: '-32px', top: '5px' }}></div>
                    <h6 className="mb-0 text-danger">❌ Pedido Cancelado / Dado de Baja</h6>
                    <small className="text-muted">Operación anulada sin costos financieros asociados.</small>
                  </div>
                )}

                {/* Hito 4: Entrega Final */}
                <div className="position-relative">
                  <div className={`position-absolute rounded-circle ${
                    pedido.estado === 'entregado' ? 'bg-success' : 'bg-light border border-secondary'
                  }`} style={{ width: '12px', height: '12px', left: '-32px', top: '5px' }}></div>
                  <h6 className={`mb-0 ${pedido.estado === 'entregado' ? 'text-success' : 'text-muted'}`}>
                    🚚 Entregado en Ventanilla
                  </h6>
                  <small className="text-muted">El alumno retiró la vianda del buffet del campus.</small>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;