import { Router } from 'express';
import { login, checkRefreshToken } from '../controllers/authentication';
import { verifyRefreshTokenInRedis, verifyRefreshToken } from '../middlewares/authorization';

const router = Router();

router
    .post('/login', login)
    .post('/refreshToken', verifyRefreshTokenInRedis, verifyRefreshToken, checkRefreshToken);

export default router;
