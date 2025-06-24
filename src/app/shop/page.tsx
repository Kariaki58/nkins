import { getProducts, getCategories } from '@/lib/products';
import { ShopClient } from '@/components/shop/ShopClient';

export const metadata = {
  title: 'Shop All Collections - Nkins Online',
  description: 'Browse our full collection of beautiful dresses, tops, skirts, and jumpsuits. Find your perfect outfit at Nkins Online.',
};

export default function ShopPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">Our Collection</h1>
        <p className="text-muted-foreground mt-2">Discover pieces that tell your story.</p>
      </div>
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
