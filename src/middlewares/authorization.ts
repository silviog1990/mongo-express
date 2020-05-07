import * as JWT from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../utils/constants';
import logger from '../utils/logger';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, JWT_SECRET);
};

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next, JWT_REFRESH_SECRET);
};

const verifyToken = async (req: Request, res: Response, next: NextFunction, secret: string) => {
    try {
        let token = req.header('Authorization');
        token = token ? token.substr(7) : '';
        const decoded = await JWT.verify(token, secret);
        res.locals.decoded = decoded;
        next();
    } catch (error) {
        logger.error(error);
        if (error.expiredAt) {
            return res.status(401).json({error});
        }
        res.status(403).json({error});
    }
};
