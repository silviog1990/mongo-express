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