//*It is a plugin but it is implemented within the presentation because it is necessary for the application.
import express, { Router } from 'express';
import fileUpload from 'express-fileupload'; //*TODO: Crearle su plugin.
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { envs } from '../configuration';

export interface ServerAppOptions {
    port: number;
    // routes: Router;
}

export class AppServer {
    public app = express();
    private readonly port: number;
    // private readonly routes: Router;

    constructor( serverAppOptions : ServerAppOptions ){
        this.port = serverAppOptions.port;
        // this.routes = serverAppOptions.routes;

        this.configure();
    }

    async start(){
      this.app.listen( this.port, () => {
          console.log( `Server is running on port ${this.port}` );
      });
    }

    public setRoutes( router: Router ){
      this.app.use(router);
    }

    async configure(){
      const allowedOrigins = envs.CORS_ORIGINS;

        this.app.use(
          cors({
            origin: (origin, callback) => {
              // Permite requests sin origen (por ejemplo, desde Postman o curl)
              if (!origin) return callback(null, true);
              if (allowedOrigins.includes(origin)) {
                return callback(null, true);
              }
              return callback(new Error('Not allowed by CORS'));
            },
            credentials: true
          }),
        );
        this.app.use(cookieParser());
        this.app.use(express.json()); //raw json
        this.app.use(express.urlencoded({ extended: true })); //* form data
        this.app.use(fileUpload({
            // useTempFiles : true, //activar para archivos grandes
            limits: { fileSize: 50 * 1024 * 1024 },
        }));
    }

}


