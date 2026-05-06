import { Request, Response, NextFunction } from 'express';

// Esta función recibe tu controlador y devuelve una versión 
// que captura errores automáticamente.
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};