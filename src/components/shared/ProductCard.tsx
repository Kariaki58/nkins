'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import type { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };


  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-lg border-border/50 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`} className="block overflow-hidden">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.variants[0].imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="dress"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg font-medium tracking-normal">
          <Link
            href={`/product/${product.slug}`}
            className="
              block 
              hover:text-primary transition-colors 
              truncate 
              max-w-full 
              sm:whitespace-normal sm:line-clamp-2
            "
            title={product.name}
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold text-primary/90">
          {formatPrice(product.basePrice)}
        </p>
      </CardFooter>

    </Card>
  );
}
