'use client';

import { useState } from 'react';
import TrackOrderForm from './TrackOrderForm';
import TrackOrderDetails from './TrackOrderDetails';


export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface Order {
  _id: string;
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  shipping?: number;
  tax?: number;
  transactionId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// 🟢 Props for children components
interface TrackOrderFormProps {
  onSubmit: (orderId: string) => void;
}

interface TrackOrderDetailsProps {
  order: Order;
}

export default function TrackOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (orderId: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found");
      const data: Order = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading order...</p>;
  if (order) return <TrackOrderDetails order={order} />;

  return (
    <div>
      <TrackOrderForm onSubmit={handleTrack} />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
