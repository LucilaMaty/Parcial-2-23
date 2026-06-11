import { useEffect, useState } from 'react';
import pedidosService from '../services/pedidosService';

const AdminDashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        setLoading(true);
        const data = await pedidosService.obtenerResumenAdmin();
        setResumen(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Panel de Control Administrador</h2>
      
      <div className="row g-4">
        {/* Tarjeta: Total de Pedidos */}
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Total Pedidos</h5>
              <p className="display-4 fw-bold">{resumen.totalPedidos}</p>
            </div>
          </div>
        </div>

        {/* Tarjeta: Recaudación Total */}
        <div className="col-md-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Recaudación (Sin Cancelados)</h5>
              <p className="display-4 fw-bold">${resumen.recaudacionTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tarjeta: Pedidos Pendientes (Acción Urgente) */}
        <div className="col-md-4">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Pendientes de Confirmar</h5>
              <p className="display-4 fw-bold">{resumen.porEstado.pendiente}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Distribución por Estado</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Confirmados <span className="badge bg-info rounded-pill">{resumen.porEstado.confirmado}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Entregados <span className="badge bg-secondary rounded-pill">{resumen.porEstado.entregado}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Cancelados <span className="badge bg-danger rounded-pill">{resumen.porEstado.cancelado}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-end">
        <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>🔄 Actualizar Datos</button>
      </div>
    </div>
  );
};

export default AdminDashboard;