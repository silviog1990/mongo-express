import Mongoose from 'mongoose';
import { DBURL, DBPORT, DBUSER, DBPASSWORD } from './utils/constants';
import logger from './utils/logger';
import { MongoError } from 'mongodb';

export class DBConnection {
    private static instance: DBConnection;
    private url: string;

    private constructor() {
        this.url = `mongodb://${DBUSER}:${DBPASSWORD}@${DBURL}:${DBPORT}`;
        DBConnection.connect(this.url);
    }

    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    private static connect(url: string) {
        Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                logger.debug('database connected');
            })
            .catch((err: MongoError) => {
                logger.error(err);
            });
    }
}
