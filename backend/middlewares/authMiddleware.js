const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Verificar existencia del header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Autenticación requerida',
      details: 'Header Authorization no presente'
    });
  }

  // 2. Validar formato del token (Bearer token)
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({
      error: 'Formato de token inválido',
      details: 'Debe ser: Bearer [token]'
    });
  }

  const token = parts[1];

  // 3. Verificar estructura básica del JWT
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    return res.status(400).json({
      error: 'Token mal formado',
      details: 'El JWT debe tener 3 partes separadas por puntos'
    });
  }

  // 4. Verificar el token con JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Fuerza el algoritmo HS256
      ignoreExpiration: false // Asegura que verifique la expiración
    });
    
    // 5. Validaciones adicionales del payload
    if (!decoded.id || !decoded.rol) {
      return res.status(400).json({
        error: 'Token inválido',
        details: 'Payload del token incompleto'
      });
    }
    
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    
    let errorMessage = 'Token inválido';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expirado';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Token mal formado';
    }
    
    return res.status(403).json({
      error: errorMessage,
      details: error.message,
      code: 'INVALID_TOKEN'
    });
  }
};