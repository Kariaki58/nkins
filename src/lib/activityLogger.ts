import Activity from "../../models/activity";
import { connectToDatabase } from "./mongoose";

// Define types for activity data
interface ActivityData {
    type: string;
    description: string;
    metadata: Record<string, any>;
    user?: string | null;
}

interface Order {
    _id: string | any; // Can be ObjectId or string
    total: number;
}

interface Product {
    _id: string | any; // Can be ObjectId or string
    name: string;
}

interface User {
    _id: string | any; // Can be ObjectId or string
    email?: string;
}

// Type for the logActivity function parameters
interface LogActivityParams {
    type: string;
    description: string;
    metadata: Record<string, any>;
    user?: string | null;
}

export const logActivity = async (activityData: LogActivityParams): Promise<void> => {
    try {
        await connectToDatabase();
        await Activity.create(activityData);
    } catch (error) {
        throw new Error("Failed to log activity");
    }
};

// Common activity types with proper typing
export const Activities = {
    orderCreated: (order: Order, user?: User | null): ActivityData => ({
        type: "order_created",
        description: `New order #${order._id.toString().substring(0, 4)}`,
        metadata: { 
            orderId: order._id, 
            amount: order.total 
        },
        user: user?._id?.toString() ?? null
    }),
    
    productUpdated: (product: Product, user?: User | null): ActivityData => ({
        type: "product_updated",
        description: `Product updated: ${product.name}`,
        metadata: { 
            productId: product._id 
        },
        user: user?._id?.toString() ?? null
    }),
    
    userRegistered: (newUser: User): ActivityData => ({
        type: "user_registered",
        description: `New user: ${newUser.email}`,
        metadata: { 
            userId: newUser._id 
        },
        user: newUser._id?.toString()
    })
};