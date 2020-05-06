import mongoose, { Document, Schema } from 'mongoose';

export interface User {
    username: string;
    password: string;
}

export interface UserDocument extends User, Document {
    // some methods or properties
}

const UserSchema: Schema = new Schema({
    username: String,
    password: String,
});

export default mongoose.model<UserDocument>('User', UserSchema);
