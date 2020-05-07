import { Router } from 'express';
import { getDirector, addDirector, getDirectors, deleteDirector, updateDirector } from '../controllers/directors';
import { verifyJWT } from '../middlewares/authorization';

const router = Router();
router
    .use(verifyJWT)
    .get('/', getDirectors)
    .get('/:id', getDirector)
    .post('/', addDirector)
    .put('/:id', updateDirector)
    .delete('/:id', deleteDirector);

export default router;
