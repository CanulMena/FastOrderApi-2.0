import { DishDatasource } from '../../domain/datasource';
import { DishRepository } from '../../domain/repositories/dish.repository';

export class DishRepositoryImpl implements DishRepository {

  constructor(
    private readonly dishDatasource: DishDatasource
  ){}

  async createDish(dish: any) {
    return this.dishDatasource.createDish(dish);
  }
  
}