'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/products';
import { ProductCard } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShopClientProps {
  products: Product[];
  categories: string[];
}

const PRODUCTS_PER_PAGE = 8;

export function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory
      ? products.filter(p => p.category === selectedCategory)
      : [...products];

    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return parseInt(a.id) - parseInt(b.id);
        });
        break;
    }
    return filtered;
  }, [selectedCategory, sortOption, products]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(null)}
            className={cn("rounded-full", selectedCategory === null && "bg-primary text-primary-foreground")}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category._id} // Use a unique identifier from your object
              variant={selectedCategory === category._id ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category._id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 min-h-[400px]">
        {paginatedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {paginatedProducts.length === 0 && (
          <div className="text-center col-span-full py-16 flex items-center justify-center">
              <p className="text-muted-foreground">No products found for this selection.</p>
          </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
