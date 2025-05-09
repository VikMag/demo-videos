const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Rutas públicas (sin autenticación)
router.get('/', documentoController.getAllDocuments);
router.get('/:id', documentoController.getDocumentsByVideoId);

// Rutas solo para administradores (requieren autenticación y rol admin)
router.post('/', 
  authMiddleware,  // Verifica autenticación primero
  isAdmin,        // Luego verifica que sea admin
  documentoController.createDocumento
);

router.delete('/:id', 
  authMiddleware,  // Verifica autenticación primero
  isAdmin,        // Luego verifica que sea admin
  documentoController.delete
);

module.exports = router;