const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// ======================
// RUTAS PÚBLICAS (GET)
// ======================
router.get('/', videoController.getAll); // Obtener todos los videos
router.get('/categorias', videoController.getAllCategories); // Obtener categorías
router.get('/category/:categoryId', videoController.getByCategory); // Videos por categoría

// ======================
// RUTAS PRIVADAS (ADMIN)
// ======================
router.post('/',
  authMiddleware, // Requiere autenticación
  isAdmin,       // Requiere rol de admin
  videoController.create
);

router.delete('/:id',
  authMiddleware, // Requiere autenticación
  isAdmin,       // Requiere rol de admin
  videoController.delete
);

module.exports = router;