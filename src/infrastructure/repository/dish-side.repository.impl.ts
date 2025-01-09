import { DishSideDatasource } from "../../domain/datasource";
import { DishSideRepository } from "../../domain/repositories";


export class DishSideRespositoryImpl implements DishSideRepository {
    
    constructor(
        private readonly dishSideDatasource: DishSideDatasource
    ) {}

    async deleteSidesByDishId(dishId: number): Promise<number> {
        return this.dishSideDatasource.deleteSidesByDishId(dishId);
    }

    async createMany(dishId: number, sidesId: number[]): Promise<void> {
        return this.dishSideDatasource.createMany(dishId, sidesId);
    }
}