import mongoose, { Schema, Model, Document } from "mongoose";


interface IUser extends Document {
    name: string;
    email: string;
    googleId?: string;
    avatar?: string;
    role?: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}


const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: (props: { value: string }) => `${props.value} is not a valid email!`
        },
        index: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

UserSchema.index({ email: 1, googleId: 1 });

interface IUserModel extends Model<IUser> {}

const User: IUserModel = mongoose.models.User || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;