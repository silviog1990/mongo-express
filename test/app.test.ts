import request from 'supertest';
import app from '../src/app';
import { DBConnection } from '../src/db';
import { CacheConnection } from '../src/cache';

const db = DBConnection.getInstance();
const redis = CacheConnection.getInstance();

beforeAll((done) => {
    done();
});

describe('Test the health path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
    });
});

afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    db.disconnect();
    redis.disconnect();
    done();
});
