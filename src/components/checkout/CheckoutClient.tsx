'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePaystackPayment } from 'react-paystack';

const checkoutSchema = z.object({
  // Shipping
  email: z.string().email({ message: "Please enter a valid email." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z.string().min(4, { message: "Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
});

export function CheckoutClient() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Nigeria",
    },
  });

  const watchedEmail = form.watch('email');

  const config = {
    reference: (new Date()).getTime().toString(),
    email: watchedEmail,
    amount: cartTotal * 100, // Amount in Kobo
    publicKey: 'pk_test_fe3c7c857fbdf1e647efae4259d89937f3914562',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log("Payment successful with reference:", reference);
    toast({
      title: "Payment Successful!",
      description: "Thank you for your purchase. A confirmation has been sent to your email.",
    });
    clearCart();
    router.push('/shop');
  };

  const onClose = () => {
    console.log('Paystack modal closed.');
    toast({
      title: "Payment Cancelled",
      description: "You can try again anytime.",
      variant: "destructive",
    });
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Shipping details validated:", values);
    if (cartTotal > 0 && values.email) {
      initializePayment({onSuccess, onClose});
    } else {
        toast({
            title: "Cannot proceed to payment",
            description: "Please ensure your cart is not empty and you have entered a valid email.",
            variant: "destructive"
        })
    }
  }
  
  if (cartItems.length === 0) {
      return (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground/50" />
          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">You can't checkout without any items.</p>
          <Button asChild className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      );
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-12">
      <div className="mb-12 lg:mb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="123 Fashion Ave" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="Lagos" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl><Input placeholder="100242" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
                <Wallet className="mr-2" />
                Pay with Paystack
            </Button>
          </form>
        </Form>
      </div>

      <div className="lg:sticky top-24 h-fit">
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-md overflow-hidden border">
                    <Image src={item.images[0]} alt={item.name} layout="fill" objectFit="cover" data-ai-hint="dress" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
