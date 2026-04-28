import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // 1. Capturamos el tiempo de inicio
  const start = process.hrtime();

  // 2. Escuchamos el evento 'finish' de la respuesta
  // Este evento se dispara cuando los datos ya se han enviado al cliente
  res.on('finish', () => {
    // 3. Calculamos la diferencia
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    // 4. Formateamos el log con colores o símbolos para legibilidad
    const method = req.method; // GET, POST, etc.
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`[${method}] ${url} - ${status} (${timeInMs}ms)`);
  });

  // 5. ¡No olvides el next()! Si no, la petición se quedará colgada aquí.
  next();
};