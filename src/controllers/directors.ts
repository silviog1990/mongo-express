import { NextFunction, Response, Request } from 'express';
import DirectorModel, { DirectorDocument } from '../models/director';
import logger from '../utils/logger';

export const getDirector = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.send('Hello World');
};

export const getDirectors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    DirectorModel.find((err, directors) => {
        res.json({ payload: directors });
    });
};

export const addDirector = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { firstname, lastname, birthdate, gender } = req.body;
    const director: DirectorDocument = new DirectorModel({
        firstname,
        lastname,
        birthdate,
        gender,
    });
    director
        .save()
        .then((v) => {
            res.json({ payload: v });
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({ err });
        });
};
