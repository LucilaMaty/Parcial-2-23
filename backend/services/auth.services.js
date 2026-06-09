// src/services/auth.service.js
import Usuario from '../models/usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  // 1. REGISTRAR USUARIO
  async registrar({ nombre, email, password, rol }) {
    // Validar si el email ya existe (Restricción de BD)
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new Error('El email ya se encuentra registrado');
    }

    // Hashear la contraseña de forma segura antes de guardar
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear y persistir el usuario en SQLite
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      passwordHash,
      rol: rol || 'usuario', // Por defecto rol 'usuario'
      activo: true
    });

    // Retornamos el usuario omitiendo la contraseña en la respuesta
    const { passwordHash: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    return usuarioSinPassword;
  }

  // 2. INICIAR SESIÓN (LOGIN)
  async login(email, password) {
    // Buscar al usuario por su credencial única
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.activo) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }

    // Verificar si la contraseña coincide con el hash almacenado
    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValido) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }

    // Generar el payload del JWT sin incluir datos sensibles (como la contraseña)
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    // Firmar el token JWT utilizando el secreto de las variables de entorno
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

    return {
      usuario: payload,
      token
    };
  }
}

export default new AuthService();