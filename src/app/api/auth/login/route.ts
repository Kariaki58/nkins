import 'dotenv/config';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const lowercasedEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowercasedEmail }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const tokenPayload = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        
        return NextResponse.json({ 
            message: 'Login successful',
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Login API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
