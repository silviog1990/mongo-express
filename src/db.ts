import Mongoose from 'mongoose';
import { DBURL, DBPORT, DBUSER, DBPASSWORD } from './utils/constants';
import logger from './utils/logger';
import { MongoError } from 'mongodb';

export class DBConnection {
    private static instance: DBConnection;

    private constructor() {
        DBConnection.connect();
    }

    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    private static connect() {
        const url = `mongodb://${DBUSER}:${DBPASSWORD}@${DBURL}:${DBPORT}`;
        Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                logger.debug('database connected');
            })
            .catch((err: MongoError) => {
                logger.error(err);
            });
    }
}
