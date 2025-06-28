'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, X, User } from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from "next-auth/react";

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import Logo from '../shared/Logo';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact Us' },
];

export function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const NavLink = ({ href, label }: NavLink) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
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
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* User/Auth Section */}
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href={session.user?.role === "admin" ? "/dashboard" : "/"}>
                <Button variant="ghost" size="icon" className="p-0">
                  {session.user?.image ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt="User avatar"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:block">
              <Button variant="outline">Login</Button>
            </Link>
          )}

          {/* Cart Button */}
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

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background">
              <div className="flex justify-between items-center p-4 border-b">
                <Logo />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="mt-8 flex flex-col space-y-6 px-4">
                {navLinks.map(link => (
                  <NavLink key={link.href} {...link} />
                ))}
                
                {/* Mobile Auth Links */}
                <div className="pt-4 border-t">
                  {session ? (
                    <>
                      <Link
                        href={session.user?.role === "admin" ? "/dashboard" : "/"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-foreground/80 hover:text-primary"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut();
                        }}
                        className="block py-2 text-foreground/80 hover:text-primary w-full text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-foreground/80 hover:text-primary"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}