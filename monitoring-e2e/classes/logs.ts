// logger.ts
import * as winston from 'winston';
import { appSecretData } from '../controllers/clarisaController';

// const baseMessage = `[${getDate()}] (${from.client_id}) ${from.sender_mis.acronym} - ${from.sender_mis.environment}:`;
// client_id => CLarisa
// sender_mis.acronym => clarisa lo manda, el acronimo de la app
const from = {
  client_id: 'CLarisa',
  sender_mis: {
    acronym: 'Ms 3',
    environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
  }
};
// logger.ts

const baseMessage = () => ({
  client_id: from.client_id, // Asegúrate de que 'from' está definido y accesible
  acronym: from.sender_mis.acronym,
  environment: from.sender_mis.environment,
  date: new Date().toISOString()
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format(info => {
      // Asegúrate de que el mensaje es un objeto para que format.json() pueda procesarlo
      if (typeof info.message === 'string') {
        info.message = {
          appSecretData,
          detail: info.message
        };
      } else {
        // Extender info.message con los campos base si ya es un objeto
        info.message = { ...baseMessage(), ...info.message };
      }
      return info;
    })(),
    winston.format.json() // Esto debe ser el último en la cadena de formatos para convertir correctamente todo a JSON
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default logger;
