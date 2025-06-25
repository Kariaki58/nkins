'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    exp: number;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    const checkToken = useCallback(() => {
        const token = getCookie('token');
        if (token) {
            try {
                const decodedUser: User = jwtDecode(token);
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser(decodedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkToken();
    }, [checkToken]);

    const logout = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                setUser(null);
                toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
                router.push('/');
                router.refresh();
            } else {
                 throw new Error('Logout failed');
            }
        } catch (error) {
             toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
        }
    }, [router, toast]);

    const value = {
        user,
        setUser: (newUser: User | null) => {
            setUser(newUser);
            if(newUser) router.refresh();
        },
        isAuthenticated: !!user,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
