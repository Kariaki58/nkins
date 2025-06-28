import mongoose, { Schema, Model, Document } from "mongoose";

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
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ 'variants.colors': 1 });
ProductSchema.index({ 'variants.sizes': 1 });

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
    
    next();
});

interface IProductModel extends Model<IProduct> {}

const Product: IProductModel = mongoose.models.Product || mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;