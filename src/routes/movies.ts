import { Router } from 'express';
import { getMovies } from '../controllers/movies';

const router = Router();

router.get('/', getMovies);

export default router;
