import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pedidosService from '../services/pedidosService';

const FormularioPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    menuId: '',
    cantidad: 1,
    turnoEntrega: 'almuerzo',
    puntoRetiro: 'Campus Buffet',
    observaciones: ''
  });

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  useEffect(() => {
    const inicializarPantalla = async () => {
      try {
        setLoading(true);
        // 1. Cargar menús disponibles (Asumimos que el servicio tiene este método)
        const menusData = await pedidosService.obtenerMenusDisponibles?.() || [];
        setMenus(menusData);

        // 2. Si es edición, cargar los datos del pedido actual
        if (esEdicion) {
          const pedido = await pedidosService.obtenerPedidoPorId(id);
          setFormData({
            menuId: pedido.menu?.id || pedido.menuId,
            cantidad: pedido.cantidad,
            turnoEntrega: pedido.turnoEntrega,
            puntoRetiro: pedido.puntoRetiro,
            observaciones: pedido.observaciones || ''
          });
          // Si tenemos los datos del menú en el pedido, seteamos el precio
          if (pedido.menu) setPrecioUnitario(pedido.menu.precio);
        }
      } catch (err) {
        setError('Error al cargar la información: ' + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    };

    inicializarPantalla();
  }, [id, esEdicion]);

  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    const menuSelected = menus.find(m => m.id === parseInt(selectedId));
    setFormData({ ...formData, menuId: selectedId });
    setPrecioUnitario(menuSelected ? menuSelected.precio : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      if (esEdicion) {
        await pedidosService.editarPedido(id, formData);
      } else {
        // Para el alta, el backend suele requerir la fecha (hoy)
        const dataAlta = { ...formData, fecha: new Date().toISOString().split('T')[0] };
        await pedidosService.crearPedido(dataAlta);
      }
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6">
        <div className="card shadow border-0">
          <div className={`card-header text-white ${esEdicion ? 'bg-info' : 'bg-primary'}`}>
            <h4 className="mb-0">{esEdicion ? `✏️ Editando Pedido #${id}` : '🛒 Solicitar Nueva Vianda'}</h4>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Seleccionar Menú</label>
                <select 
                  className="form-select" 
                  value={formData.menuId} 
                  onChange={handleMenuChange}
                  required
                  disabled={esEdicion} // Generalmente no se permite cambiar el menú una vez pedido
                >
                  <option value="">-- Seleccione un plato --</option>
                  {menus.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre} - ${m.precio}</option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Cantidad</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1" 
                    value={formData.cantidad}
                    onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 1})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Turno</label>
                  <select 
                    className="form-select" 
                    value={formData.turnoEntrega}
                    onChange={(e) => setFormData({...formData, turnoEntrega: e.target.value})}
                  >
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Punto de Retiro</label>
                <select 
                  className="form-select" 
                  value={formData.puntoRetiro}
                  onChange={(e) => setFormData({...formData, puntoRetiro: e.target.value})}
                >
                  <option value="Campus Buffet">Campus Buffet (Principal)</option>
                  <option value="Dirección">Dirección de Alumnos</option>
                  <option value="Cantina">Cantina de Deportes</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Observaciones (Opcional)</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="Ej: Sin sal, alérgico al maní..."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                ></textarea>
              </div>

              {precioUnitario > 0 && (
                <div className="alert alert-info d-flex justify-content-between align-items-center">
                  <span>Total Estimado:</span>
                  <strong className="fs-5">${(precioUnitario * formData.cantidad).toLocaleString()}</strong>
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success flex-grow-1 fw-bold" disabled={enviando}>
                  {enviando ? 'Procesando...' : esEdicion ? 'Guardar Cambios' : 'Confirmar Pedido'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioPedido;