import mongoose, { Mongoose } from 'mongoose';

// Define types for our cached connection
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Extend globalThis to include our mongoose cache
declare global {
    var mongoose: MongooseCache;
}

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to the .env.local file');
}

// Initialize cached connection
let cached: MongooseCache = (globalThis as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Mongoose> {
    try {
        // Return cached connection if available
        if (cached.conn) {
            return cached.conn;
        }

        // Create new connection promise if none exists
        if (!cached.promise) {
            const opts: mongoose.ConnectOptions = {
                serverSelectionTimeoutMS: 100000,
            };

            cached.promise = mongoose.connect(MONGODB_URI, opts)
                .then((mongoose) => mongoose)
                .catch((err) => {
                    // Reset promise on error to allow retries
                    cached.promise = null;
                    throw err;
                });
        }

        // Await the connection promise
        cached.conn = await cached.promise;
    } catch (err) {
        // Reset connection on error
        cached.conn = null;
        throw err;
    }

    // Store the cache in globalThis for reuse
    (globalThis as any).mongoose = cached;
    
    return cached.conn;
}