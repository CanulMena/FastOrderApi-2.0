import { Request, Response } from 'express';
import { SideRepository } from "../../domain/repositories/index";
import { CreateSideDto, UpdateSideDto } from '../../domain/dtos/side/index';
import { CreateSide, DeleteSide, GetSide, GetSides, UpdateSide } from '../../domain/use-cases/side';
import { CustomError } from '../../domain/errors';

export class SideController {

    constructor(
        public sideRepository: SideRepository
    ) {}

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    public getSides = (req: Request, res: Response) => {
        new GetSides(this.sideRepository)
        .execute()
        .then( sides => res.status(200).json(sides))
        .catch( error => this.handleError(error, res));
    }

    public getSideById = (req: Request, res: Response) => {
        const sideId = +req.params.sideId;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        new GetSide(this.sideRepository)
        .execute(sideId)
        .then(side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

    public postSide = (req: Request, res: Response) => {

        const [error, sideDto] = CreateSideDto.create(req.body);

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        new CreateSide(this.sideRepository)
        .execute(sideDto!)
        .then( side => res.status(201).json(side))
        .catch( error => this.handleError(error, res));
    }

    public deleteSide = (req: Request, res: Response) => {
        const sideId = +req.params.sideId;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        new DeleteSide(this.sideRepository)
        .execute(sideId)
        .then( side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

    public updateSide = ( req: Request, res: Response ) => {
        const sideId = +req.params.sideId;
        const [error, updateSideDto] = UpdateSideDto.create({...req.body, sideId});

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        new UpdateSide(this.sideRepository)
        .execute(updateSideDto!)
        .then( side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

}