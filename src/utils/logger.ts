import winston from 'winston';
import { NODE_ENV, ENVIRONMENT } from './constants';

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: NODE_ENV === ENVIRONMENT.PRODUCTION ? 'error' : 'debug',
        }),
        new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
    ],
};

const logger = winston.createLogger(options);

if (NODE_ENV !== ENVIRONMENT.PRODUCTION) {
    logger.debug('Logging initialized at debug level');
}

export default logger;
