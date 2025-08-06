import { SchedDish, WeekDays } from "../../entities/index";

export class CreateSchedDishDto {
  constructor(
      public dishId: number,
      public kitchenId: number,
      public weekDay: WeekDays,
      public SchedDishPortionLimit?: number,
      public controlRations: boolean = false,
  ){}

  static create(object: { [key: string]: any }): [string?, CreateSchedDishDto?] {
    const { dishId, kitchenId, weekDay, schedDishPortionLimit, controlRations } = object;

    if( !dishId ) return ['dishId is required'];
    if( isNaN(dishId) ) return ['dishId must be a number'];
    if( !kitchenId ) return ['kitchenId is required'];
    if( isNaN(kitchenId) ) return ['kitchenId must be a number'];
    if( !weekDay ) return ['weekDay is required'];
    if( !SchedDish.isValidWeekDay(weekDay) ) return [`Invalid week day: ${weekDay} - valid values: ${SchedDish.validWeekDays}`];
    if( schedDishPortionLimit ) { // solo aceptaremos valores thurty
      if( isNaN(schedDishPortionLimit) ) return ['SchedDishPortionLimit must be a number'];
    }
    if( controlRations !== undefined && typeof controlRations !== 'boolean' ) return ['controlRations must be a boolean'];

    return [undefined, new CreateSchedDishDto( dishId, kitchenId, weekDay, schedDishPortionLimit, controlRations )];
  }
}