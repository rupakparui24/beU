import { match } from 'assert';
import mongoose ,{ Schema, Document } from 'mongoose';

export interface Message extends Document {
    content : string;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const userSchema: Schema = new Schema({
    username:{
        type: String,
        required: [true, 'Username is required'],
        trim : true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Email is invalid'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verification code expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});

export const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', userSchema)