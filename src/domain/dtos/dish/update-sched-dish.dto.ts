import { SchedDish, WeekDays } from "../../entities";

export class UpdateSchedDishDto {
    constructor(
        public id: number,
        public weekDay?: WeekDays,
        // public SchedDishPortionLimit?: number,
        // public controlRations: boolean = false,
    ) {}

    static create( object: {[key: string]: any } ): [string?, UpdateSchedDishDto?] {
        const { id, weekDay } = object;

        if (!id || isNaN(Number(id))) return ['ID argument must be a valid number'];
        if (!SchedDish.isValidWeekDay(weekDay)) return [`Invalid week day: ${weekDay} - valid values: ${SchedDish.validWeekDays}`]; 

        return [ undefined, new UpdateSchedDishDto(id, weekDay) ];
    }
}