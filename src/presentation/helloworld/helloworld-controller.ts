import { Request, Response, Router } from 'express';

export class HelloWorldController {

    public getHelloWorld = (req: Request, res: Response) => {
        res.status(200).send('Hello World');
        return;
    }

}