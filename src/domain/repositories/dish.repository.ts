import { Dish } from "../entities";

export abstract class DishRepository {
  abstract createDish(dish: any): Promise<Dish>;
}