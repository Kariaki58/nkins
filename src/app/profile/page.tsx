'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Shield, User as UserIcon, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader className="text-center">
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2 w-full">
                           <Skeleton className="h-6 w-full" />
                           <Skeleton className="h-6 w-full" />
                           <Skeleton className="h-6 w-full" />
                        </div>
                         <Skeleton className="h-10 w-24" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        // Middleware should handle this, but as a fallback:
        router.push('/admin/login');
        return null;
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline">Your Profile</CardTitle>
                    <CardDescription>View and manage your account details.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    <Avatar className="w-24 h-24 text-3xl">
                        <AvatarImage src={`https://placehold.co/100x100.png`} alt={user?.name} />
                        <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    
                    {user && (
                        <div className="text-left w-full space-y-4 pt-4">
                            <div className="p-3 bg-secondary/30 rounded-md">
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="text-lg font-semibold">{user.name}</p>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-md">
                                <p className="text-sm text-muted-foreground">Email Address</p>
                                <p className="text-lg font-semibold">{user.email}</p>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-md">
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="text-lg font-semibold capitalize flex items-center gap-2">
                                    {user.role === 'admin' ? <Shield className="h-5 w-5 text-primary" /> : <UserIcon className="h-5 w-5 text-muted-foreground" />}
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    )}

                    <Button onClick={logout} variant="outline" className="mt-4">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
