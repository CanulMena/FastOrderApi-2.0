import { CreateSideDto } from "../dtos/side/create-side.dto";
import { Side } from "../entities";

export abstract class SideRepository {
    abstract createSide( side : CreateSideDto ) : Promise<Side>;
    abstract getSides() : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteSide( sideId: number ) : Promise<Side>;
    // abstract updateSide( side: Side ) : Promise<Side>;
}