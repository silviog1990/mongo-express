import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { NODE_ENV, ENVIRONMENT } from './utils/constants';
import morgan from 'morgan';
import indexRouter from './routes/index';
import moviesRouter from './routes/movies';
import { DBConnection } from './db';

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

app.use('/api/v1', indexRouter);
app.use('/api/v1/movies', moviesRouter);

export default app;
