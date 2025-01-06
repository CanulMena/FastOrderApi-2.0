import { DishDatasource } from '../../domain/datasource';
import { Dish } from '../../domain/entities';
import { DishRepository } from '../../domain/repositories/dish.repository';

export class DishRepositoryImpl implements DishRepository {

  constructor(
    private readonly dishDatasource: DishDatasource
  ){}

  async createDish(dish: any) {
    return this.dishDatasource.createDish(dish);
  }

  async getDishById( dishId: number ): Promise<Dish>{
    return this.dishDatasource.getDishById(dishId);
  }

  async deleteDish(dishId: number): Promise<Dish> {
    return this.dishDatasource.deleteDish(dishId);
  }
  
}