import { Router } from 'express';
import { getDirector, addDirector, getDirectors } from '../controllers/directors';

const router = Router();

router
    .get('/', getDirectors)
    .get('/:lastname', getDirector)
    .post('/', addDirector)
    .patch('/:director', getDirector)
    .put('/:director', getDirector);

export default router;
