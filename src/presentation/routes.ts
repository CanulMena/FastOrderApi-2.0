import { Router } from "express";
import { HelloWorldRoutes } from "./helloworld/helloworld-routes";

export class AppRoutes {
    static get routes(): Router {

        const router = Router();

        router.use('/api/HelloWorld', HelloWorldRoutes.routes);

        return router;
    }
}