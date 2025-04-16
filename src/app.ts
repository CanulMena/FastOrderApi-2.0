import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { envs } from "./configuration/plugins/envs";
import { cloudinaryAdapter } from "./configuration";
import { CronService } from "./presentation/cron/cron-service";
import { LoadingDailyRations } from "./domain/use-cases/index";

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

    CronService.createCronJob(
        '0 5 * * *' /* '* * * * *' */,
        async () => {
            // console.log('⏰ Ejecutando cron para cargar raciones del día...');
            await new LoadingDailyRations().execute();
        }
    )

    const server = new AppServer({
        port: envs.PORT,
        routes: AppRoutes.routes
    });
    
    server.start();

}