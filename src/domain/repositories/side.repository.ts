import { CreateSideDto, UpdateSideDto } from "../dtos/side";
import { Side } from "../entities";

export abstract class SideRepository {
    abstract createSide( side : CreateSideDto ) : Promise<Side>;
    abstract getSides() : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteBySide( sideId: number ) : Promise<Side>;
    abstract updateSide( side: UpdateSideDto ) : Promise<Side>;
}