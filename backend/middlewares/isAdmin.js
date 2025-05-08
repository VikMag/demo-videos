// middlewares/isAdmin.js
module.exports = (req, res, next) => {
    // Verifica si el usuario es admin (el middleware authMiddleware ya validó el token)
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado: Se requiere rol de administrador' 
      });
    }
    next();
  };