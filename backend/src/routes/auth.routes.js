// src/routes/auth.routes.js
import express from 'express';
import { registrar, login } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registrar);

// POST /api/auth/login
router.post('/login', login);

export default router;