const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas PÚBLICAS
router.get('/', videoController.getAll); // GET /videos/ (catálogo completo)
router.get('/categorias', videoController.getAllCategories); // GET /videos/ (catálogo completo)

// Rutas PRIVADAS
router.post('/', authMiddleware, videoController.create);
router.delete('/:id', authMiddleware, videoController.delete);

module.exports = router;