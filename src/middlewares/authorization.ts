import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/constants';
import logger from '../utils/logger';
import { CacheConnection } from '../cache';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, JWT_SECRET);
};

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, JWT_REFRESH_SECRET, true);
};

export const verifyRefreshTokenInRedis = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).send();
    }
    const redisClient = CacheConnection.getInstance().getClient();
    redisClient.get(refreshToken, async (err, reply) => {
        // reply is null when the key is missing
        if (!reply) {
            return res.status(403).send();
        }
        next();
    });
}

const verifyToken = async (req: Request, res: Response, next: NextFunction, secret: string, isRefreshToken: boolean = false) => {
    let token: string = req.header('Authorization') || req.body.token || req.params.token || req.body.refreshToken || '';
    try {
        token = token.startsWith('Bearer') ? token.substr(7) : token;
        const decoded = await JWT.verify(token, secret);
        res.locals.decoded = decoded;
        next();
    } catch (error) {
        logger.error(error);
        if (error.expiredAt && !isRefreshToken) {
            res.header('WWW-Authenticate', 'Bearer');
            return res.status(401).json({ error });
        }
        if (isRefreshToken) {
            const redisClient = CacheConnection.getInstance().getClient();
            redisClient.del(token)
        }
        res.status(403).json({ error });
    }
};
