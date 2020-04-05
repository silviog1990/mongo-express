import mongoose, { Document, Schema } from 'mongoose';

export interface Director {
    firstname: string;
    lastname: string;
    birthdate: Date;
    gender: string;
}

export interface DirectorDocument extends Director, Document {
    // some methods or properties
}

const DirectorSchema: Schema = new Schema({
    firstname: String,
    lastname: String,
    birthdate: Date,
    gender: String,
});

export default mongoose.model<DirectorDocument>('Director', DirectorSchema);
