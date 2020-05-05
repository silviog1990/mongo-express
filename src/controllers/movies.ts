import { NextFunction, Response, Request } from 'express';
import MovieModel, { Movie, MovieDocument } from '../models/movie';
import logger from '../utils/logger';

export const getMovies = (req: Request, res: Response, next: NextFunction) => {
    MovieModel.find((err, movies) => {
        if (err) {
            logger.error(err);
            return res.status(500).json({ payload: [] });
        }
        res.json({ payload: movies });
    });
};

export const getMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    try {
        const movie = await MovieModel.findById(id);
        if (movie === undefined || movie === null) {
            return res.status(404).send();
        }
        res.json({ payload: movie });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ err: error });
    }
};

export const addMovie = (req: Request, res: Response, next: NextFunction) => {
    const { title, duration, genres, director } = req.body as Movie;
    const movie: MovieDocument = new MovieModel({
        title,
        duration,
        genres,
        director,
    });
    movie
        .save()
        .then((v) => {
            res.status(201).json({ payload: v });
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({ err });
        });
};

export const updateMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const movie: Movie = req.body;
    try {
        const result = await MovieModel.findByIdAndUpdate(id, movie);
        if (result) {
            return res.json({ payload: result });
        }
        res.status(404).send();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ err: error });
    }
};

export const deleteMovie = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    MovieModel.deleteOne({ _id: id })
        .then((v) => {
            if (v.deletedCount && v.deletedCount > 0) {
                return res.status(204).send();
            }
            res.status(404).send();
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).json({ err });
        });
};
