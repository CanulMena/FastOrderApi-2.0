import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { envs } from "./configuration/plugins/envs";
import { cloudinaryAdapter } from "./configuration";
import { v2 as cloudinary } from 'cloudinary';

(async => {
    main();
})();

function main(){

    cloudinaryAdapter
    .configure(
        envs.CLOUDINARY_CLOUD_NAME,
        envs.CLOUDINARY_API_KEY,
        envs.CLOUDINARY_API_SECRET
    );

    const server = new AppServer({
        port: envs.PORT,
        routes: AppRoutes.routes
    });
    
    server.start();

}