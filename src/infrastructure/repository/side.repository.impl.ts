import { SideDatasource } from "../../domain/datasource/side.datasource";
import { UpdateSideDto, CreateSideDto, PaginationDto } from "../../domain/dtos/index";
import { Side } from "../../domain/entities";
import { SideRepository } from "../../domain/repositories/side.repository";


export class SideRepositoryImpl implements SideRepository {

    constructor(
        private datasource: SideDatasource
    ) {}

    createSide(side: CreateSideDto): Promise<Side> {
        return this.datasource.createSide(side);
    }

    getSides(pagination: PaginationDto) : Promise<Side[]>{
        return this.datasource.getSides(pagination);
    }

    getSidesCount(): Promise<number>{
        return this.datasource.getSidesCount();
    }

    getSidesByKitchenId(kitchenId: number, pagination: PaginationDto) : Promise<Side[]>{
        return this.datasource.getSidesByKitchenId(kitchenId, pagination);
    }

    getSidesByKitchenIdCount(kitchenId: number): Promise<number>{
        return this.datasource.getSidesByKitchenIdCount(kitchenId);
    }

    getSideById( sideId: number ) : Promise<Side>{
        return this.datasource.getSideById(sideId);
    }

    deleteBySide( sideId: number ) : Promise<Side>{
        return this.datasource.deleteSide(sideId);
    }
    
    updateSide(side: UpdateSideDto): Promise<Side> {
        return this.datasource.updateSide(side);
    }
    
    findSideByNameAndKitchenId(name: string, kitchenId: number): Promise<Side | null> {
        return this.datasource.findSideByNameAndKitchenId(name, kitchenId);
    }
}
