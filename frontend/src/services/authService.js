// @ts-nocheck
/* eslint-disable */
import api from './api';

const authService = {
  // 📝 DEBE LLAMARSE 'registro' PARA QUE MATCHEE CON LA PANTALLA
  registro: async (nombre, email, password) => {
    try {
      // Le pega al endpoint del backend que crearon tus compañeros
      const respuesta = await api.post('/auth/register', { nombre, email, password });
      return respuesta.data;
    } catch (error) {
      const mensaje = (error.response && error.response.data && error.response.data.error) || 'Error al registrar el usuario';
      throw new Error(mensaje);
    }
  },

  // 🔐 CONTROL DE INICIO DE SESIÓN
  login: async (email, password) => {
    try {
      const respuesta = await api.post('/auth/login', { email, password });
      return respuesta.data;
    } catch (error) {
      const mensaje = (error.response && error.response.data && error.response.data.error) || 'Credenciales inválidas';
      throw new Error(mensaje);
    }
  }
};

export default authService;