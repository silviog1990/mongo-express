import Mongoose, { Connection } from 'mongoose';
import { DBPORT, DBUSER, DBPASSWORD, DBHOST } from './utils/constants';
import logger from './utils/logger';
import { EventEmitter } from 'events';
import { Events } from './utils/events';

export class DBConnection {
    private static instance: DBConnection;

    private user: string;
    private password: string;
    private host: string;
    private port: number;
    private url: string;
    private connection: Connection;

    private constructor() {
        this.user = DBUSER;
        this.password = DBPASSWORD;
        this.host = DBHOST;
        this.port = +DBPORT;
        this.url = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}`;
        this.connection = this.connect(this.url);
        this.connection.on('open', () => {
            logger.info('db connected');
        });
        this.connection.on('error', (err) => {
            logger.error(err);
            process.exit(1);
        });
        this.connection.on('close', (err) => {
            logger.info('db closed');
            const eventEmitter = Events.getInstance().getEventEmitter();
            eventEmitter.emit('dbDisconnected');
        });
    }

    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    public getUser(): string {
        return this.user;
    }

    public getHost(): string {
        return this.host;
    }

    public getPort(): number {
        return this.port;
    }

    public getConnection(): Connection {
        return this.connection;
    }

    public disconnect() {
        this.connection.close();
    }

    private connect(url: string) {
        Mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        return Mongoose.connection;
    }
}
