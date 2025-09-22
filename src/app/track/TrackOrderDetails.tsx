'use client';

import { Order } from './page'; // import Order type from TrackOrderPage
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TrackOrderDetailsProps {
  order: Order;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
] as const;

export default function TrackOrderDetails({ order }: TrackOrderDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/track-order" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Order Tracking</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{String(order._id).slice(0, 6)}</CardTitle>
              <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
            </div>
            {/* <Badge 
              variant={
                order.status === 'delivered' ? 'default' :
                order.status === 'cancelled' ? 'destructive' : 'secondary'
              }
              className="text-sm py-1 px-3 capitalize"
            >
              {order.status}
            </Badge> */}
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative mb-4">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = statusSteps.findIndex(s => s.key === order.status) >= index;
                
                return (
                  <div key={step.key} className="flex flex-col items-center z-10">
                    <div className={`rounded-full p-2 ${
                      isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs mt-2 ${isCompleted ? 'font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
              <div className="absolute top-5 left-10 right-10 h-1 bg-muted">
                <div 
                  className="h-1 bg-primary transition-all duration-500"
                  style={{ 
                    width: `${(statusSteps.findIndex(s => s.key === order.status) / (statusSteps.length - 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex border rounded-lg p-4">
                <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.variant?.color} | {item.variant?.size} | Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="grid grid-cols-2 gap-2 max-w-xs ml-auto">
              <div>Subtotal:</div>
              <div className="text-right">{formatPrice(order.total - (order.shipping || 0))}</div>
              
              <div>Shipping:</div>
              <div className="text-right">{formatPrice(order.shipping || 0)}</div>
              
              <div className="font-medium text-lg mt-2">Total:</div>
              <div className="font-medium text-lg text-right mt-2">{formatPrice(order.total)}</div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <p>{order.formData.firstName} {order.formData.lastName}</p>
            <p>{order.formData.address} {order.formData.apartment}</p>
            <p>{order.formData.city}, {order.formData.state} {order.formData.zip}</p>
            <p>{order.formData.country}</p>
          </div>

          {/* Payment Method */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <p>Transaction ID: {order.transactionId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
