'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import Logo from '../shared/Logo';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact Us' },
];

export function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={cn(
        'text-foreground/80 transition-colors hover:text-primary',
        pathname === href && 'text-primary font-semibold',
        'text-lg md:text-sm'
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}
          {!loading && (
            isAuthenticated ? (
                <NavLink href="/admin" label="Dashboard" />
            ) : (
                <NavLink href="/admin/login" label="Admin" />
            )
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/cart" aria-label="Open shopping cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </Button>

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background">
                <div className="flex justify-between items-center p-4 border-b">
                  <Logo />
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-col space-y-6 px-4">
                  {navLinks.map(link => (
                      <NavLink key={link.href} {...link} />
                  ))}
                  {!loading && (
                    isAuthenticated ? (
                        <NavLink href="/admin" label="Dashboard" />
                    ) : (
                        <NavLink href="/admin/login" label="Admin" />
                    )
                  )}
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
