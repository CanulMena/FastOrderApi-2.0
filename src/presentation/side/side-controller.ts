import { Request, Response } from 'express';
import { SideRepository } from "../../domain/repositories/side.repository";
import { CreateSideDto } from '../../domain/dtos/side/create-side.dto';
import { UpdateSideDto } from '../../domain/dtos/side/update-side.dto';

export class SideController {

    constructor(
        public sideRepository: SideRepository
    ) {}

    public getSides = (req: Request, res: Response) => {
        this.sideRepository.getSides()
        .then( sides => res.status(200).json(sides))
        .catch( error => res.status(500).json(error));
    }

    public getSideById = (req: Request, res: Response) => {
        const sideId = +req.params.id;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        this.sideRepository.getSideById(sideId)
        .then(side => res.status(200).json(side))
        .catch(error => res.status(404).json({error: error.message}));
    }

    public postSide = (req: Request, res: Response) => {

        const [error, sideDto] = CreateSideDto.create(req.body);

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        this.sideRepository.createSide(sideDto!)
        .then( side => res.status(201).json(side))
        .catch( error => res.status(404).json({error: error.message}));
    }

    public deleteSide = (req: Request, res: Response) => {
        const sideId = +req.params.id;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        this.sideRepository.deleteSide(sideId)
        .then( side => res.status(200).json(side))
        .catch( error => res.status(404).json({error: error.message}));
    }

    public updateSide = ( req: Request, res: Response ) => {
        const id = +req.params.id;
        const kitchenId = req.body.kitchenId ? + req.body.kitchenId : undefined;
        const [error, updateSideDto] = UpdateSideDto.create({...req.body, id});

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        this.sideRepository.updateSide(updateSideDto!)
        .then( side => res.status(200).json(side))
        .catch( error => res.status(404).json({error: error.message}));
    }

}