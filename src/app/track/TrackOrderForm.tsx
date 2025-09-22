'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TrackOrderFormProps {
  onSubmit: (orderId: string) => void;
}

export default function TrackOrderForm({ onSubmit }: TrackOrderFormProps) {
  const [orderId, setOrderId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    onSubmit(orderId.trim());
  };

  return (
    <Card className="max-w-md mx-auto mt-20 p-6">
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Button type="submit">Track</Button>
        </form>
      </CardContent>
    </Card>
  );
}
