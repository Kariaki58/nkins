'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed with email:', email);
      toast({
        title: 'Subscribed!',
        description: 'Thank you for joining our newsletter.',
      });
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold">Stay In The Know</h2>
          <p className="text-muted-foreground mt-2 mb-8">
            Subscribe for the latest styles, new arrivals and sales. Plus, get 10% off your first order.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-background"
              aria-label="Email for newsletter"
            />
            <Button type="submit" size="lg">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
