const UserVideo = require('../models/UserVideo');

module.exports = {
  getVideosByUser : async (req, res) => {
    try {
      const videos = await UserVideo.getByUser(req.params.user_id);
      if (!videos || videos.length === 0) {
        return res.status(404).json({ error: 'No se encontraron videos' });
      }
      res.json(videos);
    } catch (error) {
      console.error('Error en getVideosByUser:', error);
      res.status(500).json({ error: error.message || 'Error al obtener videos' });
    }
  },

  addVideoToUser: async (req, res) => {
    try {
      const { user_id, video_id, precio_pagado } = req.body;
      const id = await UserVideo.addUserVideo(user_id, video_id, precio_pagado);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: 'Error al agregar video' });
    }
  }
};