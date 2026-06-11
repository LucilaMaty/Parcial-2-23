/* eslint-disable */
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Al arrancar la app de cero, revisamos el LocalStorage para mantener la sesión viva
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setAutenticado(true);
    }
    setCargando(false);
  }, []);

  // 👑 LA FUNCIÓN MÁGICA: Guarda el Token y el Usuario de forma global
  const loginGlobal = (datosUsuario, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
    setAutenticado(true);
  };

  // 🚪 LA FUNCIÓN DE SALIDA: Borra el baúl y limpia la memoria
  const logoutGlobal = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ usuario, autenticado, cargando, loginGlobal, logoutGlobal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};