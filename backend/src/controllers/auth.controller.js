// src/controllers/auth.controller.js
import authService from '../../services/auth.services.js';

export const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    
    // Validación básica de entrada antes de llamar al servicio
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
    }

    const usuario = await authService.registrar({ nombre, email, password, rol });
    return res.status(201).json(usuario); // 201 Created para alta exitosa
  } catch (error) {
    // Delegamos al middleware centralizado de errores o respondemos directamente
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const data = await authService.login(email, password);
    return res.status(200).json(data); // 200 OK con el token y datos del usuario
  } catch (error) {
    return res.status(401).json({ error: error.message }); // 401 Unauthorized si fallan credenciales
  }
};