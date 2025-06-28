import { notFound } from 'next/navigation';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import type { Metadata } from 'next';
import Product from "../../../../models/product";
import { connectToDatabase } from "@/lib/mongoose";
import { Product as ProductType, Review, Variant } from '@/types';

interface Params {
    slug: string;
}

interface ProductPageProps {
    params: Params;
}

interface SanitizedProduct extends Omit<ProductType, '_id' | 'variants'> {
    _id: string;
    variants: Array<Omit<Variant, '_id'> & { _id: string }>;
}

const getProduct = async (slug: string): Promise<ProductType | null> => {
    try {
        await connectToDatabase();
        const product = await Product.findOne({ slug }).lean();
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

// export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
//     const { slug } = params;
    
//     try {
//         await connectToDatabase();
//         const product = await Product.findOne({ slug }).lean();
        
//         if (!product) {
//             return {
//                 title: "Product Not Found | Elegance",
//                 description: "The product you're looking for doesn't exist.",
//             };
//         }

//         return {
//             title: `${product.name} | Buy Online at Best Price | Elegance`,
//             description: product.description || "Discover high-quality fashion items from Elegance.",
//             keywords: [
//                 product.name,
//                 `buy ${product.name}`,
//                 `${product.name} price`,
//                 `${product.name} online`,
//                 `${product.category} products`,
//                 `best ${product.name} deals`,
//                 `shop ${product.name}`
//             ].join(', '),
//             openGraph: {
//                 title: `${product.name} | Elegance`,
//                 description: product.description || "Discover high-quality fashion items from Elegance.",
//                 url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
//                 type: 'product',
//                 images: [
//                     {
//                         url: product.variants[0].imageUrl,
//                         width: 800,
//                         height: 800,
//                         alt: product.name,
//                     },
//                 ],
//             },
//             twitter: {
//                 card: 'summary_large_image',
//                 title: `${product.name} | Elegance`,
//                 description: product.description || "Discover high-quality fashion items from Elegance.",
//                 images: [product.variants[0].imageUrl],
//             },
//             alternates: {
//                 canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
//             },
//         };
//     } catch (error) {
//         console.error("Error generating metadata:", error);
//         return {
//             title: "Product Page | Elegance",
//             description: "Discover high-quality fashion items from Elegance.",
//         };
//     }
// }

function sanitizeProduct(product: ProductType): SanitizedProduct {
    return {
        ...product,
        _id: product._id?.toString(),
        variants: product.variants.map((variant) => ({
            ...variant,
            _id: variant._id?.toString(),
        })),
    };
}

// export async function generateStaticParams(): Promise<Params[]> {
//     try {
//         await connectToDatabase();
//         const products = await Product.find({}).select('slug').lean();
//         return products.map((product) => ({
//             slug: product.slug,
//         }));
//     } catch (error) {
//         console.error("Error generating static params:", error);
//         return [];
//     }
// }

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    let error: string | null = null;
    let reviews: Review[] = [];
    let averageRating = 0;
    const ratingDistribution = [0, 0, 0, 0, 0]; // For 1-5 stars

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review/${product._id}`);
        if (!response.ok) {
            error = "Could not load reviews";
        } else {
            const data = await response.json();
            reviews = data;
            
            // Calculate average rating and distribution
            if (reviews.length > 0) {
                const total = reviews.reduce((sum, review) => {
                    ratingDistribution[review.rating - 1]++;
                    return sum + review.rating;
                }, 0);
                averageRating = parseFloat((total / reviews.length).toFixed(1));
            }
        }
    } catch (err) {
        console.error("Error fetching reviews:", err);
        error = "Error loading reviews";
    }

    const sanitizedProduct = sanitizeProduct(product);

    return (
        <ProductDetailsClient 
            product={sanitizedProduct} 
            reviews={reviews} 
            averageRating={averageRating} 
            ratingDistribution={ratingDistribution} 
            error={error} 
        />
    );
}