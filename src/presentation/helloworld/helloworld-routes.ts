import { Router } from "express";
import { HelloWorldController } from "./helloworld-controller";

export class HelloWorldRoutes {
    static get routes(): Router {
        const router = Router();
        const helloWorldController = new HelloWorldController();

        router.get('/', helloWorldController.getHelloWorld); // AL NO SER STATIC TENGO QUE CREAR UNA INSTACIA DE LA CLASE

        return router;
    }
}