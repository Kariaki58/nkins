import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/ProductCard';
import { EmailSubscriptionPopup } from '@/components/home/EmailSubscriptionPopup';
import { ArrowRight } from 'lucide-react';
import { CustomerShowcase } from '@/components/home/CustomerShowcase';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSubscription } from '@/components/home/NewsletterSubscription';

export default async function Home() {
  let error = null;
  let products = [];
  let loading = true;
  
  try {
    const res = await fetch(`${process.env.HOST}/api/products?page=1&limit=20`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      error = errorData.error || "Failed to fetch products";
    } else {
      const data = await res.json();
      products = data.data || [];
    }
  } catch (err: any) {
    error = err.message || "An error occurred while fetching products";
  } finally {
    loading = false;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">No products found</p>
      </div>
    );
  }

  // Correctly filtered and sliced products
  const featuredProducts = products
    .filter(product => 
      product.status === 'featured').slice(0, 4);

  const bestSellingProducts = products
    .filter(product => product.status === 'best_seller').slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white bg-gray-800">
        <Image
          src="/nkins.png"
          alt="Elegant dress on a model"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-40"
        />
        <div className="relative z-10 p-4 bg-black bg-opacity-30 rounded-lg">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline drop-shadow-lg">
            Elegance in Every Thread
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl font-body drop-shadow-md">
            Discover our curated collection of timeless pieces, designed for the modern woman.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg">
            <Link href="/shop">Shop Now <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Collection</h2>
              <p className="text-muted-foreground mt-2">Handpicked styles, just for you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellingProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Best Sellers</h2>
              <p className="text-muted-foreground mt-2">Loved by our customers, perfect for your wardrobe.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellingProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <CustomerShowcase />
      <Testimonials />
      <NewsletterSubscription />
      <EmailSubscriptionPopup />
    </div>
  );
}