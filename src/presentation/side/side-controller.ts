import { Request, Response } from 'express';
import { FileUploadRepository, SideRepository } from "../../domain/repositories/index";
import { CreateSideDto, UpdateSideDto, PaginationDto } from '../../domain/dtos/index';
import { CreateSide, DeleteSide, GetSide, GetSides, UpdateSide, DeleteUploadedFile, FileUploadSingle } from '../../domain/use-cases/index';
import { CustomError } from '../../domain/errors';
import { User } from '../../domain/entities/index';
import { UploadedFile } from 'express-fileupload';

export class SideController {

    constructor(
        public sideRepository: SideRepository,
        public fileUploadRepository: FileUploadRepository
    ) {}

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    public getSides = (req: Request, res: Response) => {

        const user = req.body.user as User;
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if( error ){
            res.status(400).json({error});
            return;
        }
        
        new GetSides(this.sideRepository)
        .execute(user, paginationDto!)
        .then( sides => res.status(200).json(sides))
        .catch( error => this.handleError(error, res));
    }

    public getSideById = (req: Request, res: Response) => {
        const sideId = +req.params.sideId;
        const user = req.body.user as User;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        new GetSide(this.sideRepository)
        .execute(sideId, user)
        .then(side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

    public postSide = (req: Request, res: Response) => {

        const [error, sideDto] = CreateSideDto.create(req.body);

        const file = req.body.files.at(0) as UploadedFile;
        const folderType = req.params.type;
        const user = req.body.user as User;

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        const fileUploadSingle: FileUploadSingle= new FileUploadSingle(this.fileUploadRepository);
        const deleteUploadedFile: DeleteUploadedFile = new DeleteUploadedFile(this.fileUploadRepository);
        const folder = user.rol === 'SUPER_ADMIN'
        ? `Kitchen1/${folderType}`
        : `Kitchen${user.kitchenId}/${folderType}`;
        new CreateSide(
            this.sideRepository, 
            fileUploadSingle, 
            deleteUploadedFile

        )
        .execute(
            sideDto!, 
            file, 
            folder
        )
        .then( side => res.status(201).json(side))
        .catch( error => this.handleError(error, res));
    }

    public deleteSide = (req: Request, res: Response) => {
        const sideId = +req.params.sideId;
        const user = req.body.user as User;

        if ( isNaN(sideId) ) {
            res.status(400).json({error: 'ID argument is not a number'});
        }

        new DeleteSide(this.sideRepository)
        .execute(sideId, user)
        .then( side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

    public updateSide = ( req: Request, res: Response ) => {
        const sideId = +req.params.sideId;
        const user = req.body.user as User;
        const [error, updateSideDto] = UpdateSideDto.create({...req.body, sideId});

        if ( error ) {
            res.status(400).json({error});
            return;
        }

        new UpdateSide(this.sideRepository)
        .execute(updateSideDto!, user)
        .then( side => res.status(200).json(side))
        .catch( error => this.handleError(error, res));
    }

}