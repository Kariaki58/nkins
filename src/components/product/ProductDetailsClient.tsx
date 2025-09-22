'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';

import type { Product, Variant } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface ProductDetailsClientProps {
  product: Product;
  reviews: any[];
  averageRating: number;
  ratingDistribution: number[];
  error: string | null;
}

export function ProductDetailsClient({ 
  product, 
  reviews, 
  averageRating, 
  ratingDistribution, 
  error 
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.variants[0]?.imageUrl || '');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [availableVariants, setAvailableVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { addToCart } = useCart();

  // Initialize available variants and selection
  useEffect(() => {
    setAvailableVariants(product.variants);
    
    // Set initial selected image
    if (product.variants.length > 0) {
      setSelectedImage(product.variants[0].imageUrl);
    }
  }, [product]);

  // Update available variants based on color/size selection
  useEffect(() => {
    let filteredVariants = product.variants;
    
    if (selectedColor) {
      filteredVariants = filteredVariants.filter(variant => 
        variant.colors.includes(selectedColor)
      );
    }
    
    if (selectedSize) {
      filteredVariants = filteredVariants.filter(variant => 
        variant.sizes.includes(selectedSize)
      );
    }
    
    setAvailableVariants(filteredVariants);
    
    // Auto-select a variant if only one remains
    if (filteredVariants.length === 1) {
      setSelectedVariant(filteredVariants[0]);
      setSelectedImage(filteredVariants[0].imageUrl);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product.variants]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(''); // Reset size when color changes
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.imageUrl);
    // Update selected color and size based on the variant
    if (variant.colors.length > 0) {
      setSelectedColor(variant.colors[0]);
    }
    if (variant.sizes.length > 0) {
      setSelectedSize(variant.sizes[0]);
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant before adding to cart");
      return;
    }
    
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size");
      return;
    }
    
    // Create a simplified variant with only the selected color and size
    const cartVariant = {
      ...selectedVariant,
      colors: [selectedColor],
      sizes: [selectedSize]
    };
    
    // Use the new addToCart function that accepts variant
    addToCart(product, cartVariant, quantity);
    toast.success("Added to cart");
  };
  
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  // Get all unique colors and sizes from product variants
  const allColors = Array.from(new Set(product.variants.flatMap(v => v.colors)));
  const allSizes = Array.from(new Set(product.variants.flatMap(v => v.sizes)));

  // Filter available sizes based on selected color
  const availableSizes = selectedColor 
    ? Array.from(new Set(
        product.variants
          .filter(v => v.colors.includes(selectedColor))
          .flatMap(v => v.sizes)
      ))
    : allSizes;

  // Filter available colors based on selected size
  const availableColors = selectedSize
    ? Array.from(new Set(
        product.variants
          .filter(v => v.sizes.includes(selectedSize))
          .flatMap(v => v.colors)
      ))
    : allColors;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg border shadow-sm mb-4">
            <Image
              src={selectedImage}
              alt={product.name}
              width={800}
              height={800}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => handleVariantSelect(variant)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  selectedVariant?._id === variant._id 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <Image
                  src={variant.imageUrl}
                  alt={`${product.name} variant ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="py-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{product.category}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline my-2">{product.name}</h1>
          
          {/* Price Display */}
          <div className="text-3xl font-headline text-primary/90 mb-6">
            {selectedVariant ? (
              <>
                {formatPrice(product.basePrice + (selectedVariant.priceAdjustment || 0))}
                {selectedVariant.priceAdjustment !== 0 && (
                  <span className="text-lg text-muted-foreground ml-2">
                    (Base: {formatPrice(product.basePrice)})
                  </span>
                )}
              </>
            ) : (
              formatPrice(product.basePrice)
            )}
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedColor === color
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-gray-300 hover:border-primary/50'
                  } ${!availableColors.includes(color) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!availableColors.includes(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-2 rounded-md border transition-all ${
                    selectedSize === size
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-gray-300 hover:border-primary/50'
                  } ${!availableSizes.includes(size) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!availableSizes.includes(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Selection Summary */}
          {(selectedColor || selectedSize) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Selection</h3>
              {selectedColor && <p className="text-muted-foreground">Color: {selectedColor}</p>}
              {selectedSize && <p className="text-muted-foreground">Size: {selectedSize}</p>}
              {selectedVariant && (
                <p className="text-muted-foreground mt-2">
                  Availability: {selectedVariant.stock > 0 
                    ? `${selectedVariant.stock} in stock` 
                    : 'Out of stock'}
                </p>
              )}
            </div>
          )}
          
          {/* Quantity and Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleQuantityChange(-1)} 
                className="rounded-full"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleQuantityChange(1)} 
                className="rounded-full"
                disabled={selectedVariant ? quantity >= selectedVariant.stock : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              className="flex-1"
              disabled={!selectedVariant || !selectedColor || !selectedSize || (selectedVariant && selectedVariant.stock === 0)}
            >
              {selectedVariant && selectedVariant.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> 
                  Add to Cart
                </>
              )}
            </Button>
          </div>
          
          {/* Stock information */}
          {selectedVariant && (
            <div className="mt-4 text-sm text-muted-foreground">
              {selectedVariant.stock > 0 ? (
                <>
                  <Check className="h-4 w-4 inline text-green-500 mr-1" />
                  {selectedVariant.stock} in stock
                </>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}