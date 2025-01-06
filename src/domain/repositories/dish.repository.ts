import { Dish } from "../entities";

export abstract class DishRepository {
  abstract createDish(dish: any): Promise<Dish>;
  abstract getDishById(dishId: number): Promise<Dish>;

  abstract deleteDish(dishId: number): Promise<Dish>;

}