import { CreateSideDto, UpdateSideDto, PaginationDto} from "../dtos/index";
import { Side } from "../entities";

export abstract class SideRepository {
    abstract createSide( side : CreateSideDto ) : Promise<Side>;
    abstract getSides( pagination: PaginationDto ) : Promise<Side[]>;
    abstract getSidesCount() : Promise<number>;
    abstract getSidesByKitchenId( kitchenId: number, pagination: PaginationDto ) : Promise<Side[]>;
    abstract getSidesByKitchenIdCount( kitchenId: number ) : Promise<number>;
    abstract getSideById( sideId: number ) : Promise<Side>;
    abstract deleteBySide( sideId: number ) : Promise<Side>;
    abstract updateSide( side: UpdateSideDto ) : Promise<Side>;
    abstract findSideByNameAndKitchenId( name: string, kitchenId: number ) : Promise<Side | null>;
}