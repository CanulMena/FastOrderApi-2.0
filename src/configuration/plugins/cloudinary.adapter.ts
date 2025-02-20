import { v2 as cloudinary } from 'cloudinary';
import { CustomError } from '../../domain/errors';

export interface ICloudinaryAdapter {
  configure: (cloud_name: string, api_key: string, api_secret: string) => Promise<void>;
  upload: (filePath: string, folder: string, fileName: string) => Promise<{ url: string; publicId: string }>;
}

export const cloudinaryAdapter: ICloudinaryAdapter = {

  configure: async ( cloud_name: string, api_key: string, api_secret: string ): Promise<void> => {
    cloudinary.config({
      cloud_name: cloud_name,
      api_key: api_key,
      api_secret: api_secret,
      secure: true,
    });
  },

  upload: async (filePath: string, folder: string, fileName: string): Promise<{ url: string; publicId: string }> => {
    try {
        const result = await cloudinary.uploader.upload(
          filePath, 
          {
            use_filename: true,//Si es true, cloudinary usará el nombre del archivo original, si es false, cloudinary usará un nombre aleatorio.
            unique_filename: false, //Si es true, cloudinary agregará un sufijo al nombre del archivo para hacerlo único.
            overwrite: false, //Si es true, cloudinary sobreescribirá el archivo si ya existe.
            public_id: fileName, //El nombre que tendrá el archivo en cloudinary.
            folder,
          }
        );

        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw CustomError.internalServer('Error uploading to Cloudinary');
    }
  },
  
};
