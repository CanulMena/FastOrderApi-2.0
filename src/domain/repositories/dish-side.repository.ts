
export abstract class DishSideRepository {

    abstract deleteSidesByDishId(dishId: number): Promise<number>;
    abstract createMany(dishId: number, sidesId: number[]): Promise<void>;
    
}