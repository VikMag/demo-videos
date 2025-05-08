require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración avanzada de CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://demo-videos-fawn.vercel.app',
      'https://demo-videos-fawn.vercel.app/'
    ];
    
    // Permitir solicitudes sin origen (como Postman o móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.replace(/\/$/, '') === allowedOrigin.replace(/\/$/, '')
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilitar preflight para todas las rutas
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
  console.log(`🔒 Orígenes permitidos: ${corsOptions.origin}`);
});