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
import { EventEmitter } from 'events';
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

const db = DBConnection.getInstance();
const cache = CacheConnection.getInstance();

app.get('/health', (req, res, next) => {
    res.send();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/directors', directorsRouter);
app.use('/api/v1/movies', moviesRouter);

const shutdown = () => {
    db.disconnect();
    cache.disconnect();
    const disconnectedPromises = new Array<Promise<void>>();
    const eventEmitter = Events.getInstance().getEventEmitter();

    disconnectedPromises.push(
        new Promise((resolve, reject) => {
            eventEmitter.on('dbDisconnected', () => {
                logger.debug('event db disconnected');
                resolve();
            });
        })
    );

    disconnectedPromises.push(
        new Promise((resolve, reject) => {
            eventEmitter.on('cacheDisconnected', () => {
                logger.debug('event cache disconnected');
                resolve();
            });
        })
    );

    // forced shutdown
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    // graceful shutdown
    Promise.all(disconnectedPromises).then(() => {
        logger.info('Shutdown completed.');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
