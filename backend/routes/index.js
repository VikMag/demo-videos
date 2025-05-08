const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/videos', require('./videoRoutes'));
router.use('/user-videos', require('./userVideoRoutes')); // Línea faltante
router.use('/users', require('./userRoutes'));
router.use('/documentos', require('./documentoRoutes'));

module.exports = router;