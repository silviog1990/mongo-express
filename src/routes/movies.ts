import { Router } from 'express';
import { getMovies, getMovie, addMovie, updateMovie, deleteMovie } from '../controllers/movies';

const router = Router();

router
    .get('/', getMovies)
    .get('/:id', getMovie)
    .post('/', addMovie)
    .put('/:id', updateMovie)
    .delete('/:id', deleteMovie);

export default router;
