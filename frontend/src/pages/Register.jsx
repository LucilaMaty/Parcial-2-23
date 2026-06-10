import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

const Register = () => {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmarPassword: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validación local del frontend exigida
    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const { confirmarPassword, ...datosAEnviar } = form;
      await authService.registrar(datosAEnviar);
      setExito('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="nombre" placeholder="Nombre Completo" value={form.nombre} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmarPassword" placeholder="Confirmar Contraseña" value={form.confirmarPassword} onChange={handleChange} required />
        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>⚠️ {error}</p>}
      {exito && <p style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>✅ {exito}</p>}

      <p style={{ marginTop: '15px' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default Register;