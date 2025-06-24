'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AdminHeader() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    if (status === 'loading') {
        return <div className="h-16 border-b bg-background"></div>;
    }
    
    if (!session && pathname.startsWith('/admin')) {
        return null;
    }

    if (!pathname.startsWith('/admin')) {
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
                    <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
}
