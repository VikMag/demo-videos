require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rutas
app.use('/api', require('./routes'));
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API funcionando ✅',
    endpoints: {
      api: '/api',
      frontend: process.env.FRONTEND_URL || 'No configurado'
    }
  });
});
// Iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor listo en el puerto ${process.env.PORT}`);
});