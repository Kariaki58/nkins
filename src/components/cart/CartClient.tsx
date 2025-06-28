'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
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

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.basePrice;
  }, 0);





  console.log({
    cartItems, cartTotal, clearCart
  })

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center font-semibold text-muted-foreground p-2 mb-2 border-b">
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-right">Total</div>
        </div>

        <div className="space-y-4 md:border-t">
          {cartItems.map(item => (
            <div key={item.id} className="relative flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center gap-4 p-4 border md:border-x-0 md:border-t-0 md:border-b rounded-lg shadow-sm bg-background md:rounded-none md:shadow-none">
              
              <div className="flex items-start gap-4 pr-8 md:pr-0">
                <Link href={`/product/${item.slug}`}>
                  <Image
                    src={item.variants[0].imageUrl}
                    alt={item.name}
                    width={80}
                    height={100}
                    className="rounded-md object-cover"
                    data-ai-hint="dress"
                  />
                </Link>
                <div>
                  <Link href={`/product/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-md font-semibold text-primary/90 mt-1 md:hidden">{formatPrice(item.basePrice)}</p>
                </div>
              </div>

              <p className="hidden md:block text-center font-semibold">{formatPrice(item.basePrice)}</p>
              
              <div className="flex justify-between items-center md:justify-center mt-4 md:mt-0 pt-4 border-t md:border-t-0 md:pt-0">
                <div className="flex items-center rounded-full border">
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="md:hidden font-semibold text-right">{formatPrice(item.basePrice * item.quantity)}</p>
              </div>

              <p className="hidden md:block font-semibold text-right">{formatPrice(item.basePrice * item.quantity)}</p>

              <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto">
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
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
          <Button asChild size="lg" className="w-full mt-6">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
