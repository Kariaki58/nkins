'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  apartment: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zip: z.string().min(4, { message: "Postal code is required." }),
  phone: z.string().min(10, { message: "Phone number is required." }),
});

export function CheckoutClient() {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [PaystackPop, setPaystackPop] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "Nigeria",
      state: "",
      zip: "",
      phone: ""
    },
  });

  useEffect(() => {
    setIsMounted(true);
    import("@paystack/inline-js").then((module) => {
      setPaystackPop(() => module.default);
    });
  }, []);

  console.log(cartItems)

  // ✅ use finalPrice instead of basePrice
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.finalPrice * item.quantity),
    0
  );
  const shipping = 3000;
  const total = cartTotal + shipping;

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const handlePlaceOrder = async (formData: z.infer<typeof checkoutSchema>) => {
    if (!PaystackPop) {
      toast({
        title: "Payment Error",
        description: "Payment SDK not loaded. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const totalAmount = total * 100;

    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
        email: formData.email,
        amount: totalAmount,
        onSuccess: async (transaction: any) => {
          try {
            const orderData = {
              customer: formData,
              items: cartItems.map(item => ({
                productId: item.id,
                name: item.product?.name || item.name,
                quantity: item.quantity,
                price: item.finalPrice,
                image: item.selectedVariant.imageUrl,
                category: item.product?.category || "Uncategorized",
                variant: {
                  size: item.selectedVariant?.sizes?.[0],
                  color: item.selectedVariant?.colors?.[0],
                }
              })),
              shipping,
              tax: 0,
              total,
              transactionId: transaction.reference,
            };

            const response = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error("Failed to process order");

            toast({
              title: "Order Successful!",
              description: "Thank you for your purchase. A confirmation has been sent to your email.",
            });

            clearCart();
            router.push(`/thank-you?orderId=${transaction.reference}`);
          } catch (error) {
            console.error('Order processing error:', error);
            toast({
              title: "Order Error",
              description: "There was an issue processing your order. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You can try again anytime.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    handlePlaceOrder(values);
  }

  if (!isMounted) return null;

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
    <div className="py-8">
      <div className="container px-4 mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: FORM */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input type="tel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="apartment" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </Form>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="bg-slate-50 p-6 rounded-lg h-fit sticky top-4">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h2>
            
            <div className="mb-6 space-y-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-slate-100 pb-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.selectedVariant.imageUrl}
                      alt={item.product?.name || item.name}
                      fill
                      className="object-cover object-center"
                    />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-slate-900">{item.product?.name || item.name}</h3>
                    <p className="text-sm text-slate-500">{item.product?.category}</p>
                    <p className="text-sm font-medium text-slate-900">
                      {item.quantity} × {formatPrice(item.finalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="paystack"
                    name="payment-method"
                    type="radio"
                    className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-500"
                    defaultChecked
                  />
                  <label htmlFor="paystack" className="ml-3 block text-sm font-medium text-slate-700">
                    PayStack
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
