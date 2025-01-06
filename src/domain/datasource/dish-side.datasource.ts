export abstract class DishSideDatasource {
    abstract deleteDishSide( dishId: number): Promise<number>;
}