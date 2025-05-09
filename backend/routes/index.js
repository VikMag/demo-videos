const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');


// Rutas públicas
router.use('/auth', require('./authRoutes'));

// Rutas protegidas por autenticación
router.use('/videos', authMiddleware, require('./videoRoutes'));
router.use('/user-videos', authMiddleware, require('./userVideoRoutes'));
router.use('/users', authMiddleware, require('./userRoutes'));
router.use('/documentos', authMiddleware, require('./documentoRoutes'));

// Manejo de rutas no encontradas
router.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});


module.exports = router;