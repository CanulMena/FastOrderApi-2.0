import { CreateDishDto, PaginationDto, UpdateDishDto } from "../dtos";
import { Dish } from "../entities";



export abstract class DishRepository {
  abstract createDish(dish: CreateDishDto): Promise<Dish>;
  abstract getDishes(pagination: PaginationDto): Promise<Dish[]>;
  abstract getDishesCount(): Promise<number>;
  abstract getDishesByKitchenIdCount(kitchenId: number): Promise<number>;
  abstract getDishesByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Dish[]>;
  abstract getDishById(dishId: number): Promise<Dish>;
  abstract deleteDish(dishId: number): Promise<Dish>;
  abstract updateDish(dish: UpdateDishDto): Promise<Dish>;
  abstract getDishesById( dishIds: number[] ) : Promise<Dish[]>
  abstract findDishByNameAndKitchenId( name: string, kitchenId: number ) : Promise<Dish | null>;
  abstract getDishesBySideId( sideId: number ): Promise<Dish[]>;
}