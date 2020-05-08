import { NextFunction, Response, Request } from 'express';
import UserModel, { User } from '../models/user';
import logger from '../utils/logger';
import * as JWT from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN } from '../utils/constants';
import { CacheConnection } from '../cache';

const redisClient = CacheConnection.getInstance().getClient();

const generateJWT = async (payload: any, secret: string = JWT_SECRET, config?: JWT.SignOptions): Promise<string> => {
    if (!secret) {
        secret = JWT_SECRET;
    }
    if (config === null || config === undefined) {
        // default config here
        config = {
            expiresIn: '15m',
        };
    }
    return new Promise((resolve, reject) => {
        try {
            const token = JWT.sign(payload, secret, config);
            resolve(token);
        } catch (error) {
            reject(error);
        }
    });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body as User;
    if (!(username && password)) {
        res.status(400).send();
    }
    try {
        const user = await UserModel.findOne({ username, password });
        if (user === undefined || user === null) {
            res.status(401);
            res.header('WWW-Authenticate', 'Bearer');
            return res.json({ error: 'Authentication failed! Wrong credentials.' });
        }
        const token = await generateJWT({ username }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRES_IN });
        const refreshToken = await generateJWT({ username }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN });
        const decoded = JSON.stringify(JWT.decode(refreshToken));
        await redisClient.set(refreshToken, decoded);
        res.json({ payload: { token, refreshToken } });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        let { decoded } = res.locals;
        decoded = JSON.stringify(decoded);
        const token = await generateJWT({ decoded }, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRES_IN });
        const newRefreshToken = await generateJWT({ decoded }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN });
        await redisClient.del(refreshToken);
        await redisClient.set(newRefreshToken, decoded);
        res.json({ payload: { token, refreshToken: newRefreshToken } });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};
