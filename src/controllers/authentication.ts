import { NextFunction, Response, Request } from 'express';
import UserModel, { User } from '../models/user';
import logger from '../utils/logger';
import * as JWT from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/constants';
import { CacheConnection } from '../cache';
import { verifyRefreshToken } from '../middlewares/authorization';

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
        const token = await generateJWT({ username }, JWT_SECRET, { expiresIn: '1m' });
        const refreshToken = await generateJWT({ username }, JWT_REFRESH_SECRET, { expiresIn: '2m' });
        await redisClient.set(refreshToken, username);
        res.json({ payload: { token, refreshToken } });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).send();
    }
    try {
        redisClient.get(refreshToken, async (err, reply) => {
            // reply is null when the key is missing
            if (!reply) {
                return res.status(403).send();
            }
            const ok = await verifyRefreshToken(req, res, next);
            if (ok) {
                logger.info(res.locals);
                res.json(res.locals);
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};
