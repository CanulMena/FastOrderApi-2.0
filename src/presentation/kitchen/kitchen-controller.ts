import { Request, Response } from 'express';
import { Kitchen } from '../../domain/entities/index';
import { CreateKitchenDto } from '../../domain/dtos/index';

const kitchenList: Kitchen[] = [
    new Kitchen(1, 'Cocina 1', 'Dirección 1','123456789'),
    new Kitchen(2, 'Cocina 2', 'Dirección 2','123456789'),
    new Kitchen(3, 'Cocina 3', 'Dirección 3','123456789'),
    new Kitchen(4, 'Cocina 4', 'Dirección 4','123456789'),
    new Kitchen(5, 'Cocina 5', 'Dirección 5','123456789'),
    new Kitchen(6, 'Cocina 6', 'Dirección 6','123456789'),
    new Kitchen(7, 'Cocina 7', 'Dirección 7','123456789'),
    new Kitchen(8, 'Cocina 8', 'Dirección 8','123456789'),
    new Kitchen(9, 'Cocina 9', 'Dirección 9','123456789'),
    new Kitchen(10, 'Cocina 10', 'Dirección 10', '123456789'),
];

export class KitchenController {

    constructor() {}  //TODO: inyectar repositorios al tener la capa de infraestructura

    public getKitchens = (req: Request, res: Response) => { //GET /api/kitchen
        res.status(200).json(kitchenList);
        return;
    }

    public getKitchenById = (req: Request, res: Response) => { //GET /api/kitchen/:id
        const kitchenId = +req.params.id;  //?El signo + convierte el string a number

        if( isNaN(kitchenId) ){
            res.status(400).json({error: 'ID argument is not a number' });
        }

        const kitchen = kitchenList.find(kitchen => kitchen.kitchenId === kitchenId);
        if (kitchen) {
            res.status(200).json(kitchen);
            return;
        } else {
            res.status(404).json({error: 'Kitchen not found' });
            return;
        }
    }

    public postKitchen = (req: Request, res: Response) => { //POST /api/kitchen

        const [error, kitchen] = CreateKitchenDto.create(req.body);

        if (error) {
            res.status(400).json({error});
            return;
        }

        //TODO: Agregar el kitchen al datasource para que se cree en la base de datos
    }

    public deleteKitchen = (req: Request, res: Response) => { //DELETE /api/kitchen/:id
        const kitchenId = +req.params.id;

        if( isNaN(kitchenId) ){ //? isNaN() determina si un valor es numero o no
            res.status(400).json({error: 'ID argument is not a number' });
        }

        const kitchen = kitchenList.find(kitchen => kitchen.kitchenId === kitchenId);

        if (!kitchen) {
            res.status(404).json({error: 'Kitchen not found' });
            return;
        } else {
            const index = kitchenList.indexOf(kitchen);
            kitchenList.splice(index, 1); //? splice( apartir de que numero se eliminará, cuantos eliminará apartir del numero asigando ) elimina un elemento del array
            res.status(200).json(kitchen);
        }
        
    }

}