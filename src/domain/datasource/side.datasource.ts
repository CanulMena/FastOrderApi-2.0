import { CreateSideDto, UpdateSideDto } from "../dtos/side/index";
import { Side } from "../entities/index";


export abstract class  SideDatasource {
    abstract createSide( side: CreateSideDto ) : Promise<Side>;
    abstract getSides() : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteSide( sideId: number ) : Promise<Side>;
    abstract updateSide( side: UpdateSideDto ) : Promise<Side>;

}