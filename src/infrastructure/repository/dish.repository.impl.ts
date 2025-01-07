import { DishDatasource } from '../../domain/datasource';
import { PaginationDto } from '../../domain/dtos';
import { Dish } from '../../domain/entities';
import { DishRepository } from '../../domain/repositories/dish.repository';

export class DishRepositoryImpl implements DishRepository {

  constructor(
    private readonly dishDatasource: DishDatasource
  ){}
  getDishes(pagination: PaginationDto): Promise<Dish[]> {
    return this.dishDatasource.getDishes(pagination);
  }
  getDishesCount(): Promise<number> {
    return this.dishDatasource.getDishesCount();
  }
  getDishesByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.dishDatasource.getDishesByKitchenIdCount(kitchenId);
  }
  getDishesByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Dish[]> {
    return this.dishDatasource.getDishesByKitchenId(kitchenId, pagination);
  }

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