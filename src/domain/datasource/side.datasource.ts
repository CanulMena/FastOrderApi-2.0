import { CreateSideDto } from "../dtos/side/create-side.dto";
import { Side } from "../entities";


export abstract class  SideDatasource {
    abstract createSide( side: CreateSideDto ) : Promise<Side>;
    abstract getSides() : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteSide( sideId: number ) : Promise<Side>;
    // abstract updateSide( side: CreateSideDto ) : Promise<Side>;

}