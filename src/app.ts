import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { envs } from "./configuration/plugins/envs";
import { cloudinaryAdapter } from "./configuration";
import { CronJobs } from "./presentation/cron-jobs";

(async => {
    main();
})();

function main(){
    // Configurar Cloudinary
    cloudinaryAdapter
    .configure(
        envs.CLOUDINARY_CLOUD_NAME,
        envs.CLOUDINARY_API_KEY,
        envs.CLOUDINARY_API_SECRET
    );

    // Inicializar tareas programadas
    // CronJobs.executeRationsLoad();

    // Configurar y iniciar el servidor.
    const server = new AppServer({
        port: envs.PORT,
        routes: AppRoutes.routes
    });
    
    server.start();

}