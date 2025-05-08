const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdminMiddleware = require('../middlewares/isAdmin');


router.get('/', authMiddleware, isAdminMiddleware, documentoController.getAllDocuments);

// Crear nuevo documento (a implementar)
router.post('/', authMiddleware, isAdminMiddleware, documentoController.createDocumento);

// Eliminar documento (a implementar)
router.delete('/:id', authMiddleware, documentoController.delete);

// Obtener un documento por ID
router.get('/:id', authMiddleware, documentoController.getDocumentsByVideoId);

module.exports = router;
