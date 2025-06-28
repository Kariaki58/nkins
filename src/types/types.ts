export interface Variant {
    _id?: any;
    name: string;
    price: number;
    discountedPrice?: number;
    size: string;
    color: string;
    imageUrl: string;
    stock: number;
}

export interface Product {
    _id?: any;
    name: string;
    slug: string;
    description: string;
    category: string;
    variants: Variant[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Review {
    _id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    userName?: string;
    userImage?: string;
}