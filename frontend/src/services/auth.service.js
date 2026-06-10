import API from './axios.config';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      return response.data; // Devuelve { token, usuario: { id, nombre, email, rol } }
    } catch (error) {
      // Capturamos el error estructurado enviado por nuestro middleware del backend
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión', { cause: error });
    }
  },

  registrar: async (datosUsuario) => {
    try {
      const response = await API.post('/auth/registrar', datosUsuario);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en el registro de usuario', { cause: error });
    }
  },
};