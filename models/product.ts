import mongoose, { Schema, Model, Document } from "mongoose";

// ProductStatus enum - exported here
export enum ProductStatus {
    REGULAR = 'regular',
    FEATURED = 'featured',
    BEST_SELLER = 'best_seller'
}

interface IVariant {
    colors: string[];
    sizes: string[];
    priceAdjustment?: number;
    stock?: number;
    imageUrl: string;
    sku?: string;
}

interface IProduct extends Document {
    name: string;
    description: string;
    basePrice: number;
    category: string;
    variants: IVariant[];
    slug?: string;
    isActive?: boolean;
    status?: ProductStatus;
    featuredExpiry?: Date;
    bestSellerSince?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const VariantSchema: Schema = new Schema<IVariant>({
    colors: [{ 
        type: String, 
        required: true 
    }],
    sizes: [{ 
        type: String, 
        required: true 
    }],
    priceAdjustment: { 
        type: Number, 
        default: 0 
    },
    stock: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    sku: { 
        type: String, 
        unique: true, 
        sparse: true 
    }
}, { _id: true });

const ProductSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    variants: [VariantSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.REGULAR
    },
    featuredExpiry: {
        type: Date,
        required: function() {
            return this.status === ProductStatus.FEATURED;
        }
    },
    bestSellerSince: {
        type: Date,
        required: function() {
            return this.status === ProductStatus.BEST_SELLER;
        }
    }
}, {
    timestamps: true,
});

// Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ 'variants.colors': 1 });
ProductSchema.index({ 'variants.sizes': 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featuredExpiry: 1 });
ProductSchema.index({ bestSellerSince: -1 });

// Pre-save hook
ProductSchema.pre<IProduct>('save', function(next) {
    this.updatedAt = new Date();
    
    if (!this.slug) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    
    this.variants.forEach(variant => {
        if (!variant.sku) {
            const colorCode = variant.colors[0]?.substring(0, 3).toUpperCase() || 'CLR';
            const sizeCode = variant.sizes[0]?.replace(/\s+/g, '').toUpperCase() || 'SZ';
            variant.sku = `${this.slug?.substring(0, 5)}-${colorCode}-${sizeCode}`.toUpperCase();
        }
    });

    if (this.isModified('status') && this.status === ProductStatus.BEST_SELLER && !this.bestSellerSince) {
        this.bestSellerSince = new Date();
    }
    
    next();
});

ProductSchema.methods.isFeaturedActive = function(): boolean {
    return this.status === ProductStatus.FEATURED && 
           (!this.featuredExpiry || this.featuredExpiry > new Date());
};

interface IProductModel extends Model<IProduct> {
    getFeaturedProducts(): Promise<IProduct[]>;
    getBestSellers(limit?: number): Promise<IProduct[]>;
}

const Product: IProductModel = mongoose.models.Product || mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

// Only export default here - ProductStatus is already exported at the top
export default Product;