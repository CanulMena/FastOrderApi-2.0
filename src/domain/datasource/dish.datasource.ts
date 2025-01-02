import { Dish } from "../entities";

export abstract class DishDatasource {
  abstract createDish(dish: any): Promise<Dish>;
}