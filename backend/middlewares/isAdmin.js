module.exports = (req, res, next) => {
  try {
    // 1. Verificar que exista req.user (debería venir de authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        details: 'Debe autenticarse primero'
      });
    }

    // 2. Verificar que el usuario tenga rol definido
    if (!req.user.rol) {
      return res.status(403).json({
        error: 'Acceso denegado',
        details: 'Usuario no tiene rol asignado'
      });
    }

    // 3. Verificar rol de administrador
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        details: 'Se requiere rol de administrador',
        requiredRole: 'admin',
        currentRole: req.user.rol,
        code: 'ADMIN_ACCESS_REQUIRED'
      });
    }

    // 4. Registrar acceso administrativo (opcional)
    console.log(`Acceso administrativo concedido a usuario: ${req.user.id}`);

    next();
  } catch (error) {
    console.error('Error en middleware isAdmin:', error);
    return res.status(500).json({
      error: 'Error interno al verificar permisos',
      details: error.message
    });
  }
};