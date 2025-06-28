import cloudinary from "./cloudinary";
import { UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from 'cloudinary';

// Type for the image upload result
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: any; // Allow for other Cloudinary response properties
}

// Type for the image deletion result
interface CloudinaryDeleteResult {
    result: string; // Typically 'ok' or 'not found'
    [key: string]: any; // Allow for other Cloudinary response properties
}

export const uploadImage = (buffer: Buffer | Uint8Array): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        if (!(buffer instanceof Buffer) && !(buffer instanceof Uint8Array)) {
            return reject(new Error('Invalid buffer type'));
        }

        const uploadOptions: UploadApiOptions = { 
            resource_type: 'image', 
            timeout: 150000 
        };

        cloudinary.uploader.upload_stream(
            uploadOptions, 
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(error);
                } else if (result?.secure_url) {
                    resolve(result);
                } else {
                    reject(new Error('Failed to upload image'));
                }
            }
        ).end(buffer);
    });
};

const getPublicIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts.slice(-1)[0].split('.')[0];
};

export const deleteImage = (imageUrl: string): Promise<CloudinaryDeleteResult> => {
    const publicId = getPublicIdFromUrl(imageUrl);

    return new Promise((resolve, reject) => {
        if (typeof publicId !== 'string') {
            return reject(new Error('Invalid image ID'));
        }

        cloudinary.uploader.destroy(publicId, (error: UploadApiErrorResponse | undefined, result: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};