import { CACHE_HOST, CACHE_PORT } from './utils/constants';
import * as REDIS from 'redis';
import logger from './utils/logger';
import { Events } from './utils/events';

export class CacheConnection {
    private static instance: CacheConnection;
    private host: string;
    private port: number;
    private client: REDIS.RedisClient;

    private constructor() {
        this.host = CACHE_HOST;
        this.port = +CACHE_PORT;
        this.client = this.connect(this.port, this.host);
    }

    public static getInstance(): CacheConnection {
        if (!CacheConnection.instance) {
            CacheConnection.instance = new CacheConnection();
        }
        return CacheConnection.instance;
    }

    public getHost(): string {
        return this.host;
    }

    public getPort(): number {
        return this.port;
    }

    public getClient(): REDIS.RedisClient {
        return this.client;
    }

    public disconnect() {
        this.client.quit((error, ok) => {
            if (error) {
                logger.error(error.message);
                return;
            }
            logger.info('client redis disconnected');
            const eventEmitter = Events.getInstance().getEventEmitter();
            eventEmitter.emit('cacheDisconnected');
        });
    }

    private connect(port: number, host: string): REDIS.RedisClient {
        try {
            const client = REDIS.createClient(port, host);
            logger.info('Redis connected');
            return client;
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }
}
