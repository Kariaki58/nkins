'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground/50" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-background">
              <Link href={`/product/${item.slug}`}>
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={100}
                  height={120}
                  className="rounded-md object-cover"
                  data-ai-hint="dress"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="text-md font-semibold text-primary/90 mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border">
                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="w-24 text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
            <Button variant="outline" onClick={clearCart} className="text-destructive hover:text-destructive">Clear Cart</Button>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="p-6 border rounded-lg shadow-sm bg-secondary/30 sticky top-24">
          <h2 className="text-2xl font-bold font-headline mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Calculated at next step</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <Button size="lg" className="w-full mt-6">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}
