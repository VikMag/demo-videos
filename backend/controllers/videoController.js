const Video = require('../models/Video');

module.exports = {
  getAll: async (req, res) => {
    try {
      const videos = await Video.getAll();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener videos' });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const videos = await Video.getByCategory(req.params.categoriaId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error al filtrar videos por categoría' });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categorias = await Video.getAllCategories();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  },

  create: async (req, res) => {
    try {
      const { titulo, url, categoria_id, precio = 0, imagen, descripcion } = req.body;
      
      if (!titulo || !url || !categoria_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const id = await Video.create({ titulo, url, categoria_id, precio, imagen, descripcion });
      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear video' });
    }
  },

  update: async (req, res) => {
    try {
      await Video.update(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar video' });
    }
  },

  delete: async (req, res) => {
    try {
      await Video.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar video' });
    }
  }
};