import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return new NextResponse(JSON.stringify({ message: 'Name, email, and password are required' }), { status: 400 });
        }

        if (password.length < 6) {
             return new NextResponse(JSON.stringify({ message: 'Password must be at least 6 characters' }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: 'User with this email already exists' }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return new NextResponse(JSON.stringify({ message: 'An error occurred', error: errorMessage }), { status: 500 });
    }
}
