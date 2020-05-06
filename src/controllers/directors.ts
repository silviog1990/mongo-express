import { NextFunction, Response, Request } from 'express';
import DirectorModel, { DirectorDocument, Director } from '../models/director';
import logger from '../utils/logger';

export const getDirectors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const directors = await DirectorModel.find();
        res.json({ payload: directors });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ payload: [] });
    }
};

export const getDirector = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const director = await DirectorModel.findById(id);
        if (director === undefined || director === null) {
            return res.status(404).send();
        }
        res.json(director);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ err: error });
    }
};

export const addDirector = async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, birthdate, gender } = req.body;
    let director: DirectorDocument = new DirectorModel({
        firstname,
        lastname,
        birthdate,
        gender,
    });
    try {
        director = await director.save();
        res.status(201).json({ payload: director });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ err });
    }
};

export const updateDirector = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const director: Director = req.body;
    try {
        const result = await DirectorModel.findByIdAndUpdate(id, director);
        if (result) {
            return res.json(result);
        }
        res.status(404).send();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ err: error });
    }
};

export const deleteDirector = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const resp = await DirectorModel.deleteOne({ _id: id });
        if (resp.deletedCount && resp.deletedCount > 0) {
            return res.status(204).send();
        }
        res.status(404).send();
    } catch (err) {
        logger.error(err);
        res.status(500).json({ err });
    }
};
