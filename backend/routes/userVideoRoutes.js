const express = require('express');
const router = express.Router();
const UserVideoController = require('../controllers/userVideoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta PÚBLICA para obtener videos de usuario
router.get('/:user_id/videos', UserVideoController.getVideosByUser);

// Ruta PRIVADA para agregar videos a usuario
router.post('/videos', 
  authMiddleware,  // Solo usuarios autenticados
  UserVideoController.addVideoToUser
);

module.exports = router;