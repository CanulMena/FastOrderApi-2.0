import { Request, Response } from 'express';
import { CreateKitchenDto } from '../../domain/dtos/kitchen/index';
import { UpdateKitchenDto } from '../../domain/dtos/kitchen/update-kitchen.dto';
import { KitchenRepository } from '../../domain/repositories';

export class KitchenController {

    constructor(
        public kitchenRepository: KitchenRepository
    ){}

    public getKitchens = (req: Request, res: Response) => { //GET /api/kitchen
        this.kitchenRepository.getKitchens()
        .then( kitchens => res.status(200).json(kitchens) ) // 200 OK
        .catch( error => res.status(500).json({error}) ); // 500 internal
    }

    public getKitchenById = (req: Request, res: Response) => { //GET /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;  //?El signo + convierte el string a number
        //* Siempre cuando exista un Dto, ahí es donde irán las validaciones
        if( isNaN(kitchenId) ){
            res.status(400).json({error: 'ID argument is not a number' }); //? 400 Bad Request
        }

        this.kitchenRepository.getKitchenById(kitchenId)        
        .then( kitchen => res.status(200).json(kitchen) ) //? 200 OK
        .catch( error => res.status(404).json({ "error": error.message}) ); //? 404 Not Found
    }

    public postKitchen = (req: Request, res: Response) => { //POST /api/kitchen

        const [error, kitchenDto] = CreateKitchenDto.create(req.body);

        if (error) {
            res.status(400).json({error}); // 400 Bad Request
            return;
        }

        this.kitchenRepository.createKitchen(kitchenDto!)
        .then( kitchen => res.status(201).json(kitchen) ) // 201 Created
        .catch( error => res.status(404).json({ error: error.message }) ); // 404 Not Found
    }

    public deleteKitchen = (req: Request, res: Response) => { //DELETE /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;
        //* Siempre cuando exista un Dto, ahí es donde irán las validaciones
        if( isNaN(kitchenId) ){ //? isNaN() determina si un valor es numero o no
            res.status(400).json({error: 'ID argument is not a number' });
        }

        this.kitchenRepository.deleteKitchen(kitchenId)
        .then( kitchen => res.status(200).json(kitchen) ) // 200 OK
        .catch( error => res.status(404).json({ "error": error.message}) ); // 404 Not Found
    }

    public updateKitchen = (req: Request, res: Response) => { //PUT /api/kitchen/:id
        const kitchenId = +req.params.kitchenId;
        const [error, updateKitchenDto] = UpdateKitchenDto.create({...req.body, kitchenId});

        if (error) {
            res.status(400).json({error}); // 400 Bad Request
            return;
        }

        this.kitchenRepository.updateKitchen(updateKitchenDto!)
        .then( kitchen => res.status(200).json(kitchen) ) // 200 OK
        .catch( error => res.status(404).json({ "error": error.message}) ); // 404
    }

}