import { CreateSideDto, UpdateSideDto, PaginationDto } from "../dtos/index";
import { Side } from "../entities/index";


export abstract class  SideDatasource {
    abstract createSide( side: CreateSideDto ) : Promise<Side>;
    abstract getSides( pagination: PaginationDto ) : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteSide( sideId: number ) : Promise<Side>;
    abstract updateSide( side: UpdateSideDto ) : Promise<Side>;

}