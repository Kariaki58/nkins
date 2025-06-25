'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AdminHeader() {
    const { isAuthenticated, loading, logout } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return <div className="h-16 border-b bg-background"></div>;
    }
    
    // This check might be redundant due to middleware, but good for client-side safety
    if (!isAuthenticated && pathname.startsWith('/admin') && pathname !== '/admin/login') {
        return null;
    }

    if (!pathname.startsWith('/admin')) {
        return null;
    }
    
    // Don't render header on the login page itself
    if (pathname === '/admin/login') {
        return null;
    }

    return (
        <header className="bg-background border-b sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <Logo />
                   <span className="font-semibold text-muted-foreground text-sm hidden md:inline">Admin Panel</span>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant="ghost" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
}
