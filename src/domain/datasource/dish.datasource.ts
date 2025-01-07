import { CreateDishDto, PaginationDto } from "../dtos";
import { Dish } from "../entities";

export abstract class DishDatasource {
    abstract createDish(dish: CreateDishDto): Promise<Dish>;
    abstract getDishes(pagination: PaginationDto): Promise<Dish[]>;
    abstract getDishesCount(): Promise<number>;
    abstract getDishesByKitchenIdCount(kitchenId: number): Promise<number>;
    abstract getDishesByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Dish[]>;
    abstract getDishById(dishId: number): Promise<Dish>;
    abstract deleteDish(dishId: number): Promise<Dish>;
}