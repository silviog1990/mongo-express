import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { NODE_ENV, ENVIRONMENT } from './utils/constants';
import morgan from 'morgan';
import authRouter from './routes/authentication';
import directorsRouter from './routes/directors';
import moviesRouter from './routes/movies';
import { DBConnection } from './db';
import { CacheConnection } from './cache';
import * as swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from './swagger/swagger.json';
import logger from './utils/logger';
import { Events } from './utils/events';

// init express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
    app.use(morgan('dev'));
}

if (NODE_ENV === ENVIRONMENT.PRODUCTION) {
    app.use(helmet());
}

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/health', (req, res, next) => {
    res.send();
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/directors', directorsRouter);
app.use('/api/v1/movies', moviesRouter);

DBConnection.getInstance();
CacheConnection.getInstance()

const shutdown = () => {
    const disconnectedPromises = new Array<Promise<void>>();
    const eventEmitter = Events.getInstance().getEventEmitter();

    if (DBConnection.getInstance()) {
        DBConnection.getInstance().disconnect();
        disconnectedPromises.push(
            new Promise((resolve, reject) => {
                eventEmitter.on('dbDisconnected', () => {
                    logger.debug('event db disconnected');
                    resolve();
                });
            })
        );
    }

    if (CacheConnection.getInstance()) {
        CacheConnection.getInstance().disconnect();
        disconnectedPromises.push(
            new Promise((resolve, reject) => {
                eventEmitter.on('cacheDisconnected', () => {
                    logger.debug('event cache disconnected');
                    resolve();
                });
            })
        );
    }

    // forced shutdown
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    // graceful shutdown
    if (disconnectedPromises.length > 0) {
        Promise.all(disconnectedPromises).then(() => {
            logger.info('Shutdown completed.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
