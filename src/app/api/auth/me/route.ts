import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

async function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // This won't be sent to the client, but it's good for server-side logs.
        console.error('JWT_SECRET is not set in environment variables.');
        throw new Error('JWT_SECRET is not set.');
    }
    return new TextEncoder().encode(secret);
}

export async function GET() {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Authentication token not found.' }, { status: 401 });
    }

    try {
        const secretKey = await getSecretKey();
        const { payload } = await jwtVerify(token, secretKey);
        // Don't send the entire payload which might have sensitive info like iat/exp
        const user = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role
        };
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        // This could be due to an expired or invalid token
        return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }
}