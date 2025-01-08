import { Request, Response } from 'express';
import { CreateKitchenDto } from '../../domain/dtos/kitchen/index';
import { UpdateKitchenDto } from '../../domain/dtos/kitchen/update-kitchen.dto';
import { KitchenRepository } from '../../domain/repositories';
import { CreateKitchen, GetKitchens, DeleteKitchen, GetKitchen, UpdateKitchen } from '../../domain/use-cases/kitchen';
import { CustomError } from '../../domain/errors';

export class KitchenController {

    constructor(
        public kitchenRepository: KitchenRepository
    ){}

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    public getKitchens = (req: Request, res: Response) => { //GET /api/kitchen
        new GetKitchens(this.kitchenRepository)
        .execute()
        .then( kitchens => res.status(200).json(kitchens) ) // 200 OK
        .catch( error => this.handleError(error, res));
    }

    public getKitchenById = (req: Request, res: Response) => { //GET /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;  //?El signo + convierte el string a number
        //* Siempre cuando exista un Dto, ahí es donde irán las validaciones
        if( isNaN(kitchenId) ){
            res.status(400).json({error: 'ID argument is not a number' }); //? 400 Bad Request
        }

        new GetKitchen(this.kitchenRepository)
        .execute(kitchenId)
        .then( kitchen => res.status(200).json(kitchen) ) //? 200 OK
        .catch( error => this.handleError(error, res));
    }

    public postKitchen = (req: Request, res: Response) => { //POST /api/kitchen

        const [error, kitchenDto] = CreateKitchenDto.create(req.body);

        if (error) {
            res.status(400).json({error}); // 400 Bad Request
            return;
        }

        new CreateKitchen(this.kitchenRepository)
        .execute(kitchenDto!)
        .then( kitchen => res.status(201).json(kitchen) ) // 201 Created
        .catch( error => this.handleError(error, res));
    }

    public deleteKitchen = (req: Request, res: Response) => { //DELETE /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;
        //* Siempre cuando exista un Dto, ahí es donde irán las validaciones
        if( isNaN(kitchenId) ){ //? isNaN() determina si un valor es numero o no
            res.status(400).json({error: 'ID argument is not a number' });
        }

        new DeleteKitchen(this.kitchenRepository)
        .execute(kitchenId)
        .then( kitchen => res.status(200).json(kitchen) ) // 200 OK
        .catch( error => this.handleError(error, res));
    }

    public updateKitchen = (req: Request, res: Response) => { //PUT /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;
        const [error, updateKitchenDto] = UpdateKitchenDto.create({...req.body, kitchenId});

        if (error) {
            res.status(400).json({error}); // 400 Bad Request
            return;
        }

        new UpdateKitchen(this.kitchenRepository)
        .execute(updateKitchenDto!)
        .then( kitchen => res.status(200).json(kitchen) ) // 200 OK
        .catch( error => this.handleError(error, res));
    }

}