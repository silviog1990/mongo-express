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

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/directors', directorsRouter);
app.use('/api/v1/movies', moviesRouter);

export default app;
