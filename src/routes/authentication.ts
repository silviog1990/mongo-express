import { Router } from 'express';
import { login, checkRefreshToken } from '../controllers/authentication';

const router = Router();

router
    .post('/login', login)
    .post('/refreshToken', checkRefreshToken);

export default router;
