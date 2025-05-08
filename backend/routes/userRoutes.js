const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdminMiddleware = require('../middlewares/isAdmin');

// Rutas PRIVADAS (Solo administradores)

// Obtener todos los usuarios
router.get('/', authMiddleware, isAdminMiddleware, userController.getAllUsers);

// Crear nuevo usuario (a implementar)
router.post('/', authMiddleware, isAdminMiddleware, userController.createUser);

// Eliminar usuario (a implementar)
router.delete('/:id', authMiddleware, isAdminMiddleware, userController.deleteUser);

// Obtener un usuario por ID
router.get('/:id', authMiddleware, isAdminMiddleware, userController.getUserById);
module.exports = router;
