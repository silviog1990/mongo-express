import { NextFunction, Response, Request } from 'express';

export const getMovies = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.send('Hello World')
};
