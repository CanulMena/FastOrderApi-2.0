import { SideDatasource } from "../../domain/datasource/side.datasource";
import { CreateSideDto } from "../../domain/dtos/side/create-side.dto";
import { Side } from "../../domain/entities";
import { SideRepository } from "../../domain/repositories/side.repository";


export class SideRepositoryImpl implements SideRepository {

    constructor(
        private datasource: SideDatasource
    ) {}

    createSide(side: CreateSideDto): Promise<Side> {
        return this.datasource.createSide(side);
    }

    getSides() : Promise<Side[]>{
        return this.datasource.getSides();
    }

    getSideById( sideId: number ) : Promise<Side>{
        return this.datasource.getSideById(sideId);
    }

    deleteSide( sideId: number ) : Promise<Side>{
        return this.datasource.deleteSide(sideId);
    }
    
    // updateSide( side: CreateSideDto ) : Promise<Side>{
    //     return this.datasource.updateSide(side);
    // }
    
}