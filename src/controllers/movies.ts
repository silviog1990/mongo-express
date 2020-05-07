import { NextFunction, Response, Request } from 'express';
import MovieModel, { Movie, MovieDocument } from '../models/movie';
import logger from '../utils/logger';

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await MovieModel.find();
        res.json({ payload: movies });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const movie = await MovieModel.findById(id);
        if (movie === undefined || movie === null) {
            return res.status(404).send();
        }
        res.json({ payload: movie });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const addMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { title, duration, genres, director } = req.body as Movie;
    let movie: MovieDocument = new MovieModel({
        title,
        duration,
        genres,
        director,
    });
    try {
        movie = await movie.save();
        res.status(201).json({ payload: movie });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const movie: Movie = req.body;
    try {
        const result = await MovieModel.findByIdAndUpdate(id, movie);
        if (result) {
            return res.status(204).send();
        }
        res.status(404).send();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const resp = await MovieModel.deleteOne({ _id: id });
        if (resp.deletedCount && resp.deletedCount > 0) {
            return res.status(204).send();
        }
        res.status(404).send();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
};
