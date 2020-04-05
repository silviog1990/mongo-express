import { Director } from './director';

export interface Movie {
    title: string;
    genres: string[];
    director: Director;
    duration: number;
}
