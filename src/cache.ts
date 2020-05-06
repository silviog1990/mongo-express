import { CACHE_HOST, CACHE_PORT } from './utils/constants';
import * as REDIS from 'redis';

export class CacheConnection {
    private static instance: CacheConnection;
    private host: string;
    private port: number;
    private client: REDIS.RedisClient;

    private constructor() {
        this.host = CACHE_HOST;
        this.port = +CACHE_PORT;
        this.client = CacheConnection.connect(this.port, this.host);
    }

    public static getInstance(): CacheConnection {
        if (!CacheConnection.instance) {
            CacheConnection.instance = new CacheConnection();
        }
        return CacheConnection.instance;
    }

    public getHost(): string {
        return CacheConnection.getInstance().host;
    }

    public getPort(): number {
        return CacheConnection.getInstance().port;
    }

    public getClient(): REDIS.RedisClient {
        return CacheConnection.getInstance().client;
    }

    private static connect(port: number, host: string): REDIS.RedisClient {
        return REDIS.createClient(port, host);
    }
}
