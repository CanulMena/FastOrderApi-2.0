import { CustomError } from '../errors';
import { Dish } from './index';

const validWeekDays = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'] as const;
export type WeekDays = typeof validWeekDays[number]; //decimos que tope todos el array de validWeekDays es un string y lo guardamos en un tipo WeekDays.

export class SchedDish {

  public static readonly validWeekDays = validWeekDays;

  constructor(
    public id: number,
    public dishId: number,
    public kitchenId: number,
    public weekDay: WeekDays,
    public scheduledRations: number,
    public dish?: Dish
  ){}

  public static isValidWeekDay(weekDay: any): weekDay is WeekDays {
    return this.validWeekDays.includes(weekDay);
  }

  static fromJson( object: {[key: string] : any} ): SchedDish {
    const { id, platilloId, cocinaId, diaSemana, racionesProgramadas, platillo } = object;

    if (!diaSemana) throw CustomError.badRequest('Missing diaSemana');
    if (!SchedDish.isValidWeekDay(diaSemana)) throw CustomError.badRequest (`Invalid week day: ${diaSemana}, valid values: ${SchedDish.validWeekDays}`);
    if (!id) throw CustomError.badRequest('Missing id');
    if (!platilloId) throw CustomError.badRequest('Missing platilloId');
    if (!cocinaId) throw CustomError.badRequest('Missing cocinaId');
    if (!racionesProgramadas) throw CustomError.badRequest('Missing racionesProgramadas');
    if (typeof racionesProgramadas !== 'number') throw CustomError.badRequest('racionesProgramadas must be a number');
    if (racionesProgramadas < 0) throw CustomError.badRequest('racionesProgramadas must be greater than 0');
    if (platillo) Dish.fromJson(platillo); //validamos que el platillo sea del formato esperado.

    return new SchedDish( id, platilloId, cocinaId, diaSemana, racionesProgramadas, platillo );
  }

}