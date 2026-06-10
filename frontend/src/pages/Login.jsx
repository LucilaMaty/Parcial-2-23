import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      loginUser(data);
      navigate('/'); // Redirige a la pantalla principal
    } catch (err) {
      setError(err.message); // Muestra el error de API visible en pantalla
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>⚠️ {error}</p>}
      
      <p style={{ marginTop: '15px' }}>
        ¿No tienes cuenta? <Link to="/registrar">Regístrate acá</Link>
      </p>
    </div>
  );
};

export default Login;