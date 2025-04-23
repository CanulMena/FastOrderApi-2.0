//*It is a plugin but it is implemented within the presentation because it is necessary for the application.
import express, { Router } from 'express';
import fileUpload from 'express-fileupload'; //*TODO: Crearle su plugin.
import cors from 'cors';

export interface ServerAppOptions {
    port: number;
    routes: Router;
}

export class AppServer {
    private app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor( serverAppOptions : ServerAppOptions ){
        this.port = serverAppOptions.port;
        this.routes = serverAppOptions.routes;
    }

    async start(){
        // this.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
        this.app.use(cors({ origin: '*' }));
        // this.app.use(cookieParser());
        this.app.use(express.json()); //* raw json
        this.app.use(express.urlencoded({ extended: true })); //* form data
        this.app.use(fileUpload({
            // useTempFiles : true, //*activar para archivos grandes
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        this.app.use( this.routes );

        this.app.listen( this.port, () => {
            console.log( `Server is running on port ${this.port}` );
        });

    }

}


