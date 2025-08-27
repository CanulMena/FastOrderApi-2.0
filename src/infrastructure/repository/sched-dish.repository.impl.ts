import { CreateSchedDishDto, UpdateSchedDishDto } from '../../domain/dtos';
import { SchedDish, WeekDays } from '../../domain/entities';
import { SchedDishDatasource } from '../../domain/datasource';
import { SchedDishRepository } from '../../domain/repositories';

export class SchedDishRepositoryImpl implements SchedDishRepository {

  constructor( private datasource: SchedDishDatasource) {}

  createSchedDish(schedDish: CreateSchedDishDto): Promise<SchedDish> {
    return this.datasource.createSchedDish(schedDish);
  }

  findSchedDish(schedDish: CreateSchedDishDto): Promise<null> {
    return this.datasource.findSchedDish(schedDish);
  }

  findScheduledDishesByDay(weekDay: WeekDays): Promise<SchedDish[]> {
    return this.datasource.findScheduledDishesByDay(weekDay);
  }

  findAllSchedDishByKitchen(kitchenId: number, weekDay: WeekDays): Promise<SchedDish[]> {
    return this.datasource.findAllSchedDishByKitchen(kitchenId, weekDay);
  }

  findAllSchedDishByKitchenForWeek(kitchenId: number): Promise<SchedDish[]> {
    return this.datasource.findAllSchedDishByKitchenForWeek(kitchenId);
  }

  findAllSchedDishByDishId(dishId: number): Promise<SchedDish[]> {
    return this.datasource.findAllSchedDishByDishId(dishId);
  }

  updateSchedDish( updateSchedDishDto: UpdateSchedDishDto ): Promise<SchedDish> {
    return this.datasource.updateSchedDish( updateSchedDishDto );
  }

  deleteSchedDish( schedDishId: number ): Promise<SchedDish> {
    return this.datasource.deleteSchedDish( schedDishId );
  }
}