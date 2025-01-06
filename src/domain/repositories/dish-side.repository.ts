
export abstract class DishSideRepository {
    abstract deleteDishSide(dishId: number): Promise<number>;
}