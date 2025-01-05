import { CreateSideDto, UpdateSideDto, PaginationDto} from "../dtos/index";
import { Side } from "../entities";

export abstract class SideRepository {
    abstract createSide( side : CreateSideDto ) : Promise<Side>;
    abstract getSides( pagination: PaginationDto ) : Promise<Side[]>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteBySide( sideId: number ) : Promise<Side>;
    abstract updateSide( side: UpdateSideDto ) : Promise<Side>;
}