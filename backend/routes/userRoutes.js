const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Rutas PÚBLICAS
router.get('/', userController.getAllUsers);           // Obtener todos los usuarios (público)
router.get('/:id', userController.getUserById);       // Obtener usuario por ID (público)

// Rutas PRIVADAS (Solo administradores)
router.post('/', 
  authMiddleware,    // Verifica autenticación
  isAdmin,          // Verifica rol admin
  userController.createUser
);

router.delete('/:id', 
  authMiddleware,    // Verifica autenticación
  isAdmin,          // Verifica rol admin
  userController.deleteUser
);

module.exports = router;