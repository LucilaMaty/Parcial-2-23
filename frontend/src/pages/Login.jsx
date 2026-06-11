/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
  const [esRegistro, setEsRegistro] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorForm, setErrorForm] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exitoMsg, setExitoMsg] = useState('');

  const navigate = useNavigate();
  const { loginGlobal } = useAuth(); 

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorForm('');
    setExitoMsg('');
    setCargando(true);

    try {
      if (esRegistro) {
        if (!nombre.trim()) throw new Error('El nombre es obligatorio');
        await authService.registro(nombre, email, password);
        setExitoMsg('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
        setNombre('');
        setEsRegistro(false);
      } else {
        const datos = await authService.login(email, password);
        loginGlobal(datos.user || datos.usuario || datos, datos.token);
        
        const rol = datos.user?.rol || datos.usuario?.rol || datos.user?.role || datos.rol || 'user';
        if (rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/mis-pedidos');
        }
      }
    } catch (error) {
      setErrorForm(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow border-0 rounded-3">
          <div className={`card-header text-white text-center py-3 ${esRegistro ? 'bg-success' : 'bg-primary'}`}>
            <h3 className="mb-0">{esRegistro ? '📝 Registro de Alumno' : '🔐🔑 Iniciar Sesión'}</h3>
            <small>{esRegistro ? 'Creá tu cuenta para el Buffet' : 'Accedé al sistema de viandas'}</small>
          </div>
          
          <div className="card-body p-4">
            {errorForm && <div className="alert alert-danger text-center small py-2">{errorForm}</div>}
            {exitoMsg && <div className="alert alert-success text-center small py-2">{exitoMsg}</div>}

            <form onSubmit={manejarEnvio}>
              
              {esRegistro && (
                <div className="mb-3">
                  <label className="form-label text-muted small">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label text-muted small">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="nombre@alumnos.frm.utn.edu.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`btn w-100 my-2 fw-bold text-white ${esRegistro ? 'btn-success' : 'btn-primary'}`}
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Procesando...
                  </>
                ) : (
                  esRegistro ? 'Registrarme' : 'Ingresar al Buffet'
                )}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none"
                  onClick={() => {
                    setEsRegistro(!esRegistro);
                    setErrorForm('');
                    setExitoMsg('');
                  }}
                >
                  {esRegistro 
                    ? '¿Ya tenés cuenta? Iniciá sesión acá' 
                    : '¿Sos nuevo? Registrate de forma gratuita acá'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;