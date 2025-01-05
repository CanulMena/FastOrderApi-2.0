import { Dish } from "../entities";

export abstract class DishDatasource {
  abstract createDish(dish: any): Promise<Dish>;
  abstract getDishById(dishId: number): Promise<Dish>;

  abstract deleteDish( dishId: number ): Promise<Dish>;
  abstract deleteDishSide( dishId: number): Promise<number>;
}