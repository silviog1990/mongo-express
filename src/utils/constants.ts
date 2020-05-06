export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const PORT = process.env.NODE_PORT || 3000;
export enum ENVIRONMENT {
    DEVELOPMENT = 'dev',
    PRODUCTION = 'prod'
}
// DATABASE
export const DBUSER = process.env.MONGO_INITDB_ROOT_USERNAME || 'mongoadmin';
export const DBPASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || 'passwordMongo2020';
export const DBPORT = process.env.DBPORT || 27017;
export const DBURL = process.env.DBURL || 'localhost';
// CACHE REDIS
export const CACHE_HOST = process.env.CACHE_HOST || 'localhost';
export const CACHE_PORT = process.env.CACHE_PORT || 6379;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'verysecret';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'verysecret';
