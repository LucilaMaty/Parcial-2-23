import axios from 'axios';

// Creamos una instancia personalizada de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // La URL base de tu backend (puerto 3000)
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Este truco de arquitectura es clave para el parcial.
// Antes de que salga CUALQUIER petición al backend, este middleware de frontend
// se fija si hay un token guardado en la memoria de la computadora (localStorage)
// y lo inyecta automáticamente en los headers como Bearer token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;