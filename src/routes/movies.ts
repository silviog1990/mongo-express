import { Router } from 'express';
import { getMovies, getMovie, addMovie, updateMovie, deleteMovie } from '../controllers/movies';
import { verifyJWT } from '../middlewares/authorization';

const router = Router();

router
    .use(verifyJWT)
    .get('/', getMovies)
    .get('/:id', getMovie)
    .post('/', addMovie)
    .put('/:id', updateMovie)
    .delete('/:id', deleteMovie);

export default router;
