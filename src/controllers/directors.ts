import { NextFunction, Response, Request } from 'express';
import DirectorModel, { DirectorDocument } from '../models/director';
import logger from '../utils/logger';

export const getDirectors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    DirectorModel.find((err, directors) => {
        if (err) {
            logger.error(err);
            res.status(500).json({ payload: [] });
        }
        res.json({ payload: directors });
    });
};

export const getDirector = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { lastname } = req.params;

    // DirectorModel.find((err, directors) => {
    //     if (err) {
    //         logger.error(err);
    //         res.status(500).json({ payload: [] });
    //     }

    //     directors = directors.filter(
    //         (director) =>
    //             director.lastname.toLowerCase() === lastname.toLowerCase()
    //     );
    //     if (directors.length > 0) {
    //         res.json({ payload: directors });
    //     } else {
    //         res.status(404).json({ payload: [] });
    //     }
    // });

    // problem: case sensitive
    DirectorModel.find({ lastname })
        .exec()
        .then((directors) => {
            if (directors && directors.length) {
                res.json({ payload: directors[0] });
            } else {
                res.status(404).json({ payload: [] });
            }
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({ payload: [] });
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
