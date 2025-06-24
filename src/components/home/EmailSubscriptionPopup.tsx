'use client';

import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const POPUP_DELAY = 5000; // 5 seconds
const SESSION_STORAGE_KEY = 'nkins_popup_shown';

export function EmailSubscriptionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      }, POPUP_DELAY);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setIsSubscribed(true);
    setTimeout(() => {
        setIsOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-headline">Join Our Circle</DialogTitle>
          <DialogDescription className="text-center">
            {isSubscribed 
              ? "Thank you for subscribing! Welcome to the Nkins family."
              : "Be the first to know about new arrivals, exclusive sales, and styling tips. Get 10% off your first order!"
            }
          </DialogDescription>
        </DialogHeader>
        {!isSubscribed && (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email for subscription"
                />
                <Button type="submit" className="w-full">
                    Subscribe
                </Button>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
