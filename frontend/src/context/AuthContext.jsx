import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types'; // Importación necesaria para las validaciones de tipo

// Creación del contexto de autenticación
export const AuthContext = createContext();

// Proveedor del estado global de autenticación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la aplicación, verificamos si ya existe una sesión guardada en el navegador
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');

    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        // Limpieza selectiva si los datos están corruptos
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión y persistir los datos
  const loginUser = (data) => {
    if (!data || !data.token || !data.usuario) return;
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  // Función para cerrar sesión limpiando el almacenamiento
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loginUser, logoutUser, loading }}>
      {/* Evitamos renderizar los componentes hijos hasta que sepamos si hay un usuario persistido */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Validación profesional de las props (Soluciona la regla estricta de ESLint)
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para simplificar el uso en componentes
// Uso: const { usuario, logoutUser } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};