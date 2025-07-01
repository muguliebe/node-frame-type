import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
    },
    {
        timestamps: true,
        collection: 'users',
    }
)

// 이메일 중복 체크를 위한 인덱스
UserSchema.index({ email: 1 }, { unique: true })

export const User = mongoose.model<IUser>('User', UserSchema)
