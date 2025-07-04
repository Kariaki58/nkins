export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'Dresses' | 'Tops' | 'Skirts' | 'Jumpsuits';
  isFeatured?: boolean;
  isBestSeller?: boolean;
};

const products: Product[] = [
  {
    id: '1',
    slug: 'scarlet-elegance-maxi-dress',
    name: 'Scarlet Elegance Maxi Dress',
    description: 'A stunning full-length maxi dress in a vibrant scarlet hue. Made with a flowing chiffon fabric, it features a cinched waist and a delicate V-neckline, perfect for any formal occasion.',
    price: 35000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Dresses',
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: '2',
    slug: 'azure-bloom-midi-dress',
    name: 'Azure Bloom Midi Dress',
    description: 'Embrace the charm of our Azure Bloom Midi Dress. Featuring a beautiful floral print on a sky-blue background, this dress has puff sleeves and a comfortable A-line silhouette.',
    price: 28500,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Dresses',
    isBestSeller: true,
  },
  {
    id: '3',
    slug: 'ivory-silk-blouse',
    name: 'Ivory Silk Blouse',
    description: 'A luxurious and versatile silk blouse in a soft ivory color. Its classic design with a modern twist makes it a wardrobe staple for both professional and casual settings.',
    price: 18000,
    images: ['https://placehold.co/600x800.png'],
    category: 'Tops',
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'onyx-power-jumpsuit',
    name: 'Onyx Power Jumpsuit',
    description: 'Command attention with the Onyx Power Jumpsuit. This sleek, all-black jumpsuit features a tailored fit, wide-leg pants, and a sophisticated high neckline.',
    price: 42000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Jumpsuits',
    isBestSeller: true,
  },
  {
    id: '5',
    slug: 'rose-petal-wrap-skirt',
    name: 'Rose Petal Wrap Skirt',
    description: 'A feminine and flirty wrap skirt in a delicate rose petal pink. The lightweight fabric and ruffled hemline create beautiful movement with every step.',
    price: 15500,
    images: ['https://placehold.co/600x800.png'],
    category: 'Skirts',
  },
  {
    id: '6',
    slug: 'emerald-gala-gown',
    name: 'Emerald Gala Gown',
    description: 'Make a grand entrance with this breathtaking Emerald Gala Gown. The rich emerald green satin drapes beautifully, featuring a thigh-high slit and an elegant off-the-shoulder design.',
    price: 55000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Dresses',
    isFeatured: true,
  },
  {
    id: '7',
    slug: 'sun-kissed-linen-top',
    name: 'Sun-kissed Linen Top',
    description: 'Stay cool and chic in our Sun-kissed Linen Top. This breathable, button-down top in a cheerful yellow is perfect for sunny days and beach getaways.',
    price: 16000,
    images: ['https://placehold.co/600x800.png'],
    category: 'Tops',
  },
  {
    id: '8',
    slug: 'midnight-velvet-dress',
    name: 'Midnight Velvet Dress',
    description: 'A luxurious velvet dress in a deep midnight blue. Its body-hugging silhouette and soft texture make it the perfect choice for an elegant evening out.',
    price: 38000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Dresses',
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: '9',
    slug: 'golden-hour-slip-dress',
    name: 'Golden Hour Slip Dress',
    description: 'A radiant slip dress in a shimmering gold satin. Perfect for special evenings, it features a cowl neck and adjustable spaghetti straps for a flawless fit.',
    price: 32000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Dresses',
    isFeatured: false,
    isBestSeller: false,
  },
  {
    id: '10',
    slug: 'safari-chic-utility-jumpsuit',
    name: 'Safari Chic Utility Jumpsuit',
    description: 'Embrace adventure in style with this khaki utility jumpsuit. Made from durable cotton twill, it features a belted waist, chest pockets, and a comfortable, relaxed fit.',
    price: 39500,
    images: ['https://placehold.co/600x800.png'],
    category: 'Jumpsuits',
    isFeatured: true,
  },
  {
    id: '11',
    slug: 'terracotta-ribbed-knit-top',
    name: 'Terracotta Ribbed-Knit Top',
    description: 'A cozy and stylish ribbed-knit top in a warm terracotta shade. It has a flattering square neckline and long sleeves, making it a versatile piece for layering.',
    price: 17500,
    images: ['https://placehold.co/600x800.png'],
    category: 'Tops',
  },
  {
    id: '12',
    slug: 'pleated-midi-skirt-in-forest-green',
    name: 'Pleated Midi Skirt in Forest Green',
    description: 'An elegant pleated midi skirt in a deep forest green. The shimmering fabric and sharp pleats create a sophisticated look that can be dressed up or down.',
    price: 22000,
    images: ['https://placehold.co/600x800.png', 'https://placehold.co/600x800.png'],
    category: 'Skirts',
    isBestSeller: true,
  },
];

export function getProducts(category?: string): Product[] {
  if (category) {
    return products.filter(p => p.category === category);
  }
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getCategories(): string[] {
    return [...new Set(products.map(p => p.category))];
}
