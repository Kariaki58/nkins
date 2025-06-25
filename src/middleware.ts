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
    
    // Allow public routes
    if (!isAdminRoute) {
        return NextResponse.next();
    }
    
    // Handle authentication for admin routes
    if (isAdminRoute) {
        if (!token) {
            if (isAuthRoute) return NextResponse.next();
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secretKey = await getSecretKey();
            const { payload } = await jwtVerify(token, secretKey);

            if (payload.role !== 'admin') {
                 const url = request.nextUrl.clone();
                 url.pathname = '/';
                 return NextResponse.redirect(url);
            }

            if (isAuthRoute) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            return NextResponse.next();
        } catch (err) {
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
