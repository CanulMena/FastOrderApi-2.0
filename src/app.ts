import { AppRoutes } from "./presentation/routes";
import { AppServer } from "./presentation/server";
import { envs } from "./configuration/plugins/envs";
(async => {
    main();
})();

function main(){
    const server = new AppServer({
        port: envs.PORT,
        routes: AppRoutes.routes
    });
    
    server.start();
}