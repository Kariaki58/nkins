import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/products';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { slug: string }
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
 
  if (!product) {
    return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.'
    }
  }
 
  return {
    title: `${product.name} - Nkins Online`,
    description: product.description,
    openGraph: {
        images: [product.images[0]],
    },
  }
}


export async function generateStaticParams() {
  const products = getProducts();
 
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
