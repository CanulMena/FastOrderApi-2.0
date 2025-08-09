import { CreateSchedDishDto, UpdateSchedDishDto } from "../dtos";
import { SchedDish, WeekDays } from "../entities";

export abstract class SchedDishDatasource {
  abstract createSchedDish( schedDish: CreateSchedDishDto ): Promise<SchedDish>;
  abstract findSchedDish( schedDish: CreateSchedDishDto ): Promise<null>;
  abstract findScheduledDishesByDay( weekDay: WeekDays ): Promise<SchedDish[]>;
  abstract findAllSchedDishByKitchen( kitchenId: number, weekDay: WeekDays ): Promise<SchedDish[]>;
  abstract findAllSchedDishByKitchenForWeek( kitchenId: number ): Promise<SchedDish[]>;
  abstract findAllSchedDishByDishId( dishId: number ): Promise<SchedDish[]>;
  abstract updateSchedDish( schedDish: UpdateSchedDishDto ): Promise<SchedDish>;
  abstract deleteSchedDish( schedDishId: number ): Promise<SchedDish>;
}