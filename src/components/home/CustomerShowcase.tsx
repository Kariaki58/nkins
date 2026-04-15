import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const showcaseImages = [
    { src: '/image1.jpg', alt: 'Customer in a sharp suit', hint: 'man suit' },
    { src: '/image2.jpg', alt: 'Customer in premium trousers', hint: 'man trousers' },
    { src: '/image3.jpg', alt: 'Customer styled in accessories', hint: 'man accessories' },
    { src: '/image4.jpg', alt: 'Customer looking elegant in formal wear', hint: 'man formal' },
];

export function CustomerShowcase() {
    return (
        <section className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">#GiftoStyle</h2>
                    <p className="text-muted-foreground mt-2">See how our community rocks their Gifto Boutique fits. Tag us to be featured!</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {showcaseImages.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                data-ai-hint={image.hint}
                                width={600}
                                height={800}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/shop">Shop The Looks</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
