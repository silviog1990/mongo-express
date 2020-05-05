import { Router } from 'express';
import { getDirector, addDirector, getDirectors, deleteDirector, updateDirector } from '../controllers/directors';

const router = Router();

router
    .get('/', getDirectors)
    .get('/:id', getDirector)
    .post('/', addDirector)
    .put('/:id', updateDirector)
    .delete('/:id', deleteDirector);

export default router;
