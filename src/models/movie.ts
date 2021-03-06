import { Director } from './director';
import mongoose, { Document, Schema } from 'mongoose';

type DirectorType = { _id: string } & Director;

export interface Movie {
    title: string;
    genres: string[];
    director: DirectorType;
    duration: number;
}

export interface MovieDocument extends Movie, Document {
    // some methods or properties
}

const MovieSchema: Schema = new Schema({
    title: String,
    genres: [String],
    director: {},
    duration: String,
});

export default mongoose.model<MovieDocument>('Movie', MovieSchema);
