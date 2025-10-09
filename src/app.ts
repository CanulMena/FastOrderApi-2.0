import { createServer } from "http";
import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { envs } from "./configuration/plugins/envs";
import { cloudinaryAdapter } from "./configuration";
import { CronJobs } from "./presentation/cron-jobs";
import { WssService } from "./presentation/services/ws-service";

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

    const expressServer = new AppServer({ // Configurar el servidor de express...
        port: envs.PORT
        // routes: AppRoutes.routes
    });

    const httpServer = createServer( expressServer.app ); // Configura el servidor de node...
    WssService.initWss({ server: httpServer }); // Se crea el servidor del WebSocket con la configuración del servidor (Expres)


    expressServer.setRoutes( AppRoutes.routes );

    httpServer.listen( envs.PORT, () => { //gracias a esta configuración permite que tanto las peticiones HTTP normales como las conexciones http compartan el mismo puerto.
        console.log(`Server running on port: ${ envs.PORT }`);
    }); //* Con esta configuración actualmente ya estamos escuchando en el servidor y el ws.

}