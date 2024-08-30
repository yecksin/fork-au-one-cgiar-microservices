import { ErrorRequestHandler } from 'express';
import logger from './logs';

// Middleware de manejo de errores tipado
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Verifica si 'err' es una instancia de Error
  if (err instanceof Error) {
    // Logea el error usando Winston
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query
    });

    // Responde al cliente
    res.status(500).send('Something went wrong!');
  } else {
    // Si no es un error, simplemente pasa al siguiente middleware
    next(err);
  }
};

export default errorHandler;
