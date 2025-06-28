import Product from "../../../../../../models/product";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";
import { connectToDatabase } from "@/lib/mongoose";
import { ProductStatus } from "../../../../../../models/product";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongoose";

interface UpdateProductStatusRequest {
    status: ProductStatus;
    featuredExpiry?: string | Date;
}

interface ProductResponse {
    _id: ObjectId;
    status: ProductStatus;
    featuredExpiry?: Date;
    bestSellerSince?: Date;
    [key: string]: any;
}

interface ErrorResponse {
    error: string;
    details?: string;
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    try {
        console.log("fire!!!!!!!!!");
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json(
                { error: session ? 'Forbidden' : 'Unauthorized' },
                { status: session ? 403 : 401 }
            );
        }
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: session ? 'Forbidden' : 'Unauthorized' },
                { status: session ? 403 : 401 }
            );
        }

        await connectToDatabase();

        const { id } = await params;
        const { status, featuredExpiry }: UpdateProductStatusRequest = await req.json();

        // Validate status
        if (!Object.values(ProductStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Invalid product status' },
                { status: 400 }
            );
        }

        // Validate featured expiry if status is featured
        if (status === ProductStatus.FEATURED && !featuredExpiry) {
            return NextResponse.json(
                { error: 'Featured expiry date is required' },
                { status: 400 }
            );
        }

        const updateData: Partial<ProductResponse> = { status };
        
        // Set additional fields based on status
        if (status === ProductStatus.FEATURED) {
            updateData.featuredExpiry = new Date(featuredExpiry as string);
        } else if (status === ProductStatus.BEST_SELLER) {
            updateData.bestSellerSince = new Date();
        } else {
            // For regular status, clear special status fields
            updateData.featuredExpiry = null;
            updateData.bestSellerSince = null;
        }

        const updatedProduct: ProductResponse | null = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Product status updated successfully',
            product: updatedProduct
        }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ 
            error: 'Failed to update product status',
            details: error.message 
        }, { status: 500 });
    }
}