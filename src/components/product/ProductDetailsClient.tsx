'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

import type { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const { addToCart } = useCart();

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg border shadow-sm mb-4">
            <Image
              src={selectedImage}
              alt={product.name}
              width={800}
              height={800}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              data-ai-hint="fashion model"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  data-ai-hint="dress"
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{product.category}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline my-2">{product.name}</h1>
          <p className="text-3xl font-headline text-primary/90 mb-6">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} className="rounded-full">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={() => addToCart(product, quantity)} className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
