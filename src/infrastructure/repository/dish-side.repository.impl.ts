import { DishSideDatasource } from "../../domain/datasource";
import { DishSideRepository } from "../../domain/repositories";


export class DishSideRespositoryImpl implements DishSideRepository {
    
    constructor(
        private readonly dishSideDatasource: DishSideDatasource
    ) {}

    async deleteDishSide(dishId: number): Promise<number> {
        return this.dishSideDatasource.deleteDishSide(dishId);
    }
}