import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin';
    // añade aquí otros campos si los necesitas
  };
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: "Acceso denegado. Se requieren permisos de administrador." 
    });
  }
};