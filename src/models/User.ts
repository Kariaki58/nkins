import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is not valid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    }
}, { timestamps: true });

const User = models.User || mongoose.model('User', UserSchema);
export default User;
