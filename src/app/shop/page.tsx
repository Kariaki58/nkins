import { getProducts, getCategories } from '@/lib/products';
import { ShopClient } from '@/components/shop/ShopClient';

export const metadata = {
  title: 'Shop All Collections - Nkins Online',
  description: 'Browse our full collection of beautiful dresses, tops, skirts, and jumpsuits. Find your perfect outfit at Nkins Online.',
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const searchData = await searchParams

    console.log(searchData)


    let products = [];
    let categories = [];
    let error = null;

    try {
        const response = await fetch(`${process.env.HOST}/api/products`);
        const response2 = await fetch(`${process.env.HOST}/api/category`);

        if (!response.ok || !response2.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        products = data.data;
        categories = await response2.json();

        console.log({products})


    } catch (error: any) {
        error = error.message || "An error occurred while fetching products";
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-red-500">Error: {error}</p>
            </div>
        );
    }

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
