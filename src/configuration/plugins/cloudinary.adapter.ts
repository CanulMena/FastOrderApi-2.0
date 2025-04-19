import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CustomError } from '../../domain/errors';

export interface ICloudinaryAdapter {
  configure: (cloud_name: string, api_key: string, api_secret: string) => Promise<void>;
  uploadFileFromPath: (filePath: string, folder: string, fileName: string) => Promise<{ url: string; publicId: string }>;
  uploadFileFromBuffer: (fileBuffer: Buffer, folder: string, fileName: string) => Promise<{ url: string; publicId: string }>;
  deleteUploadedFile: (publicId: string) => Promise<void>;
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

  uploadFileFromPath: async (filePath: string, folder: string, fileName: string): Promise<{ url: string; publicId: string }> => {
    try {
        //Eliminar la extensión del fileName
        const cleanFileName = fileName.replace(/\.[^/.]+$/, ''); // Elimina cualquier extesión.

        const result = await cloudinary.uploader.upload(
          filePath, 
          {
            use_filename: true,//Si es true, cloudinary usará el nombre del archivo original, si es false, cloudinary usará un nombre aleatorio.
            unique_filename: false, //Si es true, cloudinary agregará un sufijo al nombre del archivo para hacerlo único.
            overwrite: false, //Si es true, cloudinary sobreescribirá el archivo si ya existe.
            public_id: cleanFileName, //El nombre que tendrá el archivo en cloudinary.
            folder,
          }
        );

        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw CustomError.internalServer('Error uploading to Cloudinary');
    }
  },

  uploadFileFromBuffer: async (fileBuffer: Buffer, folder: string, fileName: string): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
      //Eliminar la extensión del fileName
      const cleanFileName = fileName.replace(/\.[^/.]+$/, ''); // Elimina cualquier extesión.
      cloudinary.uploader.upload_stream(

        {
          folder,
          public_id: cleanFileName, // Opcional: Si quieres mantener el nombre del archivo
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        },

        (error, result: UploadApiResponse | undefined) => {

          if (error || !result) { // Si hay un error o no hay resultado
            console.error('Error uploading to Cloudinary:', error);
            return reject(CustomError.internalServer('Error uploading to Cloudinary'));
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        }

      ).end(fileBuffer); // Enviar el archivo en memoria

    });
  },

  deleteUploadedFile: async (publicId: string): Promise<void> => {
    try {
      const imageDeteled = await cloudinary.uploader.destroy(
        publicId,
        {resource_type: 'image', type: 'upload'}
      );
      return imageDeteled;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw CustomError.internalServer('Error deleting from Cloudinary');
    }
  },
  
};