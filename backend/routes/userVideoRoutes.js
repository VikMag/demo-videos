const express = require('express');
const router = express.Router(); // Crear el router
const authMiddleware = require('../middlewares/authMiddleware');
const UserVideoController = require('../controllers/userVideoController');

// Configurar rutas
router.get('/:user_id/videos', 
  authMiddleware,
  UserVideoController.getVideosByUser
);
router.post('/videos', 
    authMiddleware, 
    UserVideoController.addVideoToUser
  );
// Asegúrate de exportar el router
module.exports = router; // Esta línea es crucial