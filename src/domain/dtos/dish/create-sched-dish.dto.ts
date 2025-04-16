import { SchedDish, WeekDays } from "../../entities/index";

export class CreateSchedDishDto {
  constructor(
      public dishId: number,
      public kitchenId: number,
      public weekDay: WeekDays,
      public scheduledRations: number,
  ){}

  static create(object: { [key: string]: any }): [string?, CreateSchedDishDto?] {
    const { dishId, kitchenId, weekDay, scheduledRations } = object;

    if( !dishId ) return ['dishId is required'];
    if( isNaN(dishId) ) return ['dishId must be a number'];
    if( !kitchenId ) return ['kitchenId is required'];
    if( isNaN(kitchenId) ) return ['kitchenId must be a number'];
    if( !weekDay ) return ['weekDay is required'];
    if( !SchedDish.isValidWeekDay(weekDay) ) return [`Invalid week day: ${weekDay} - valid values: ${SchedDish.validWeekDays}`];
    if( !scheduledRations ) return ['scheduledRations is required'];
    if( isNaN(scheduledRations) ) return ['scheduledRations must be a number'];
    if( scheduledRations < 0 ) return ['scheduledRations must be greater than 0'];

    return [undefined, new CreateSchedDishDto( dishId, kitchenId, weekDay, scheduledRations )];
  }
}