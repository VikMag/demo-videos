const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Limitador de tasa para prevenir ataques de fuerza bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Limitar cada IP a 20 peticiones por ventana
  message: {
    error: 'Demasiados intentos',
    details: 'Por favor intente nuevamente más tarde'
  }
});

// Rutas de autenticación
router.post('/register', 
  validateRegister, // Middleware de validación
  authController.register
);

router.post('/login', 
  authLimiter, // Protección contra fuerza bruta
  validateLogin, // Middleware de validación
  authController.login
);

// Ruta para verificar estado de autenticación (opcional)
router.get('/check', authController.checkAuthStatus);

module.exports = router;