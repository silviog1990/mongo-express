import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/constants';
import logger from '../utils/logger';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    await verifyToken(req, res, next, JWT_SECRET);
};

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<boolean> => {
    const ok = await verifyToken(req, res, next, JWT_REFRESH_SECRET, true);
    return ok;
};

const verifyToken = async (req: Request, res: Response, next: NextFunction, secret: string, isRefreshToken: boolean = false): Promise<boolean> => {
    try {
        let token: string = req.header('Authorization') || req.body.token || req.params.token || req.body.refreshToken || '';
        token = token.startsWith('Bearer') ? token.substr(7) : token;
        const decoded = await JWT.verify(token, secret);
        res.locals.decoded = decoded;
        next();
        return true;
    } catch (error) {
        logger.error(error);
        if (error.expiredAt && !isRefreshToken) {
            res.status(401).json({ error });
            return false;
        }
        res.status(403).json({ error });
        return false;
    }
};
