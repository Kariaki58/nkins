import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set. Please ensure it is defined in your .env.local file and the server has been restarted.');
    }
    return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthRoute = pathname === '/admin/login' || pathname === '/register';
    
    // Handle auth routes (/admin/login, /register)
    if (isAuthRoute) {
        // If a user with a valid token tries to access login/register, redirect them to the dashboard
        if (token) {
            try {
                await jwtVerify(token, await getSecretKey());
                return NextResponse.redirect(new URL('/admin/orders', request.url));
            } catch (err) {
                // If token is invalid, let them proceed to the login page but clear the bad cookie
                const response = NextResponse.next();
                response.cookies.delete('token');
                return response;
            }
        }
        // If no token, allow access to the auth page
        return NextResponse.next();
    }
    
    // Handle protected admin routes
    if (isAdminRoute) {
        // If there's no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // If there is a token, verify it
        try {
            const { payload } = await jwtVerify(token, await getSecretKey());
            // Ensure user has admin role
            if (payload.role !== 'admin') {
                 return NextResponse.redirect(new URL('/', request.url));
            }
            // Token is valid and user is admin, allow access
            return NextResponse.next();
        } catch (err) {
            // If token is invalid, redirect to login and clear the bad cookie
            console.error('JWT verification failed:', err);
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            const response = NextResponse.redirect(url);
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/register'],
};