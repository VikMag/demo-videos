const bcrypt = require('bcrypt');
const Documento = require('../models/Documento');

module.exports = {
  getAllDocuments: async (req, res) => {
    try {
      const documentos = await Documento.getAll();
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los documentos' });
    }
  },
  // Obtener documentos por video ID
  getDocumentsByVideoId: async (req, res) => {
    const videoId = req.params.id;
    try {
      const documentos = await Documento.getByVideoId(videoId);
      if (!documentos) {
        return res.status(404).json({ error: 'Documentos no encontrados' });
      }
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los documentos' });
    }
  },

  // Crear nuevo documento
  createDocumento: async (req, res) => {
    const { nombre,url, video_id } = req.body;

    if (!nombre || !url || !video_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
      // Crear el usuario en la base de datos
      const documentId = await Documento.create({ nombre,url, video_id  });

      res.status(201).json({ id: documentId, message: 'documento creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear documento' });
    }
  },

   delete: async (req, res) => {
     try {
       await Documento.delete(req.params.id);
       res.json({ success: true });
     } catch (error) {
       res.status(500).json({ error: 'Error al eliminar' });
     }
   }
};
