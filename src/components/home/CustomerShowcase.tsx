import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const showcaseImages = [
    { src: 'https://placehold.co/600x800.png', alt: 'Customer wearing a floral dress', hint: 'woman dress' },
    { src: 'https://placehold.co/600x800.png', alt: 'Customer in a stylish jumpsuit', hint: 'woman jumpsuit' },
    { src: 'https://placehold.co/600x800.png', alt: 'Customer in a casual chic top', hint: 'woman casual' },
    { src: 'https://placehold.co/600x800.png', alt: 'Customer looking elegant in a maxi dress', hint: 'woman elegant' },
];

export function CustomerShowcase() {
    return (
        <section className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">#NkinsStyle</h2>
                    <p className="text-muted-foreground mt-2">See how our community wears their Nkins pieces. Tag us to be featured!</p>
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
