const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const requestLogger = require('../middlewares/requestLogger');

// Middleware para log de peticiones (opcional)
router.use(requestLogger);

// Rutas públicas
router.use('/auth', require('./authRoutes'));

// Rutas protegidas por autenticación
router.use('/videos', authMiddleware, require('./videoRoutes'));
router.use('/user-videos', authMiddleware, require('./userVideoRoutes'));
router.use('/users', authMiddleware, require('./userRoutes'));
router.use('/documentos', authMiddleware, require('./documentoRoutes'));

// Rutas solo para administradores
router.use('/admin', authMiddleware, isAdmin, require('./adminRoutes'));

// Manejo de rutas no encontradas
router.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo centralizado de errores
router.use((err, req, res, next) => {
  console.error('Error en ruta:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;