import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    secure: true,
});

export const cloudinaryAdapter = {
    upload: async (filePath: string, folder: string = 'default') => {
        try {
            const result = await cloudinary.uploader.upload(filePath, { folder });
            return { url: result.secure_url, publicId: result.public_id };
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Upload failed');
        }
    },

    delete: async (publicId: string) => {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            throw new Error('Delete failed');
        }
    }
};
