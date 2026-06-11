/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import pedidosService from '../services/pedidosService';

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorDetalle, setErrorDetalle] = useState('');

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

  // 🌟 FUNCIÓN AUXILIAR: Determina el color, título y mensaje según el historial
  const obtenerDatosVisuales = (historial) => {
    let estadoNuevo = '';
    
    // Intentamos parsear el JSON de valorNuevo para saber a qué estado cambió
    try {
      if (historial.valorNuevo) {
        const parsed = JSON.parse(historial.valorNuevo);
        estadoNuevo = parsed.estado || '';
      }
    } catch (e) {
      console.error("Error parseando valorNuevo", e);
    }

    const accion = historial.accion;

    // Configuración por defecto
    let color = 'secondary';
    let titulo = accion.replace('_', ' ');
    let mensaje = 'Se registró una actualización en el pedido.';

    if (accion === 'creacion') {
      color = 'primary';
      titulo = 'Pedido Creado';
      mensaje = 'El pedido ingresó al sistema y está a la espera de revisión.';
    } else if (accion === 'edicion') {
      color = 'warning';
      titulo = 'Pedido Editado';
      mensaje = 'El alumno ha modificado las cantidades o detalles del pedido.';
    } else if (accion === 'cancelacion') {
      color = 'danger';
      titulo = 'Pedido Cancelado';
      mensaje = 'El pedido ha sido anulado por el usuario y no será preparado.';
    } else if (accion === 'cambio_estado') {
      if (estadoNuevo === 'confirmado') {
        color = 'info';
        titulo = 'Pedido Confirmado';
        mensaje = 'Administración ha validado el pedido. Listo para preparación.';
      } else if (estadoNuevo === 'entregado') {
        color = 'success';
        titulo = 'Pedido Entregado';
        mensaje = 'La vianda fue retirada por el alumno exitosamente.';
      } else if (estadoNuevo === 'cancelado') {
        color = 'danger';
        titulo = 'Cancelado por Admin';
        mensaje = 'Administración ha cancelado este pedido por falta de stock u otro motivo.';
      } else {
        color = 'secondary';
        titulo = 'Cambio de Estado';
        mensaje = `El estado del pedido fue actualizado a ${estadoNuevo}.`;
      }
    }

    return { color, titulo, mensaje };
  };

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
      <button className="btn btn-sm btn-secondary mb-3" onClick={() => navigate(-1)}>
        ⬅️ Volver Atrás
      </button>

      <div className="row g-4">
        {/* COLUMNA IZQUIERDA: TARJETA PRINCIPAL DEL PEDIDO */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">📄 Detalle Estricto del Pedido</h5>
              <span className="badge bg-light text-dark fs-6">#{pedido.id}</span>
            </div>
            <div className="card-body p-4">
              <div className="mb-4 pb-3 border-bottom">
                <h4 className="text-primary mb-1">🛒 {pedido.menu?.nombre || 'Plato no disponible'}</h4>
                <div className="d-flex flex-wrap gap-3">
                  <span className="badge bg-light text-secondary border">
                    <strong>ID Menú:</strong> #{pedido.menuId}
                  </span>
                  <span className="badge bg-light text-secondary border">
                    <strong>ID Pedido:</strong> #{pedido.id}
                  </span>
                </div>
              </div>

              <p className="text-muted small mb-3">
                Solicitado por: <strong>{pedido.usuario?.nombre || 'Desconocido'}</strong> ({pedido.usuario?.email || 'N/A'})
              </p>
              
              <div className="list-group list-group-flush border rounded mb-3">
                <div className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Cantidad:</span>
                  <span className="fw-bold">{pedido.cantidad} Unidades</span>
                </div>
                <div className="list-group-item d-flex justify-content-between bg-light">
                  <span className="text-muted">Importe Total:</span>
                  <span className="fw-bold text-success fs-5">${pedido.total?.toLocaleString()}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Turno de Entrega:</span>
                  <span className="badge bg-info text-dark px-3 text-uppercase">{pedido.turnoEntrega}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Punto de Retiro:</span>
                  <span className="fw-bold">{pedido.puntoRetiro || 'No especificado'}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">Observaciones:</label>
                <div className="p-3 bg-light rounded border italic">
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

        {/* COLUMNA DERECHA: HISTORIAL DE CAMBIOS CON COLORES Y MENSAJES DINÁMICOS */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
              <h5 className="mb-0 text-dark fw-bold">Historial de Estados</h5>
            </div>
            
            <div className="card-body p-4">
              <div className="position-relative">
                {/* LÍNEA VERTICAL DE FONDO */}
                <div
                  className="position-absolute bg-secondary opacity-25"
                  style={{ width: '2px', top: '8px', bottom: 0, left: '78px' }}
                ></div>

                {pedido.historiales && pedido.historiales.length > 0 ? (
                  pedido.historiales.map((h, index) => {
                    const fecha = new Date(h.createdAt);
                    const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                    const dia = fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric', year: 'numeric' });

                    // 🌟 LLAMAMOS A NUESTRA FUNCIÓN PARA OBTENER EL ESTILO Y TEXTOS
                    const { color, titulo, mensaje } = obtenerDatosVisuales(h);

                    return (
                      <div key={h.id || index} className="d-flex position-relative mb-4">
                        
                        {/* HORA Y FECHA */}
                        <div className="text-end pe-3" style={{ width: '80px', flexShrink: 0 }}>
                          <div className="fw-bold text-dark">{hora}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{dia}</div>
                        </div>

                        {/* NODO DE COLOR DINÁMICO */}
                        <div className="position-relative d-flex justify-content-center" style={{ width: '20px' }}>
                          <div
                            className={`bg-${color} rounded-circle shadow-sm`}
                            style={{ 
                              width: '14px', 
                              height: '14px', 
                              marginTop: '5px', 
                              zIndex: 1,
                              outline: '3px solid white'
                            }}
                          ></div>
                        </div>

                        {/* TEXTOS Y MENSAJES */}
                        <div className="ps-3 flex-grow-1 pb-2">
                          <h6 className={`mb-1 text-capitalize text-${color} fw-bold`}>
                            {titulo}
                          </h6>
                          <div className="text-muted small mb-1 lh-sm">
                            {mensaje}
                          </div>
                          <div className="text-secondary opacity-75" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                            👤 Modificado por: {h.usuario?.nombre || 'Sistema'}
                          </div>
                        </div>
                        
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted small ms-5 ps-4">No hay eventos de auditoría registrados.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;