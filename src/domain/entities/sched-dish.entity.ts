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
    public SchedDishPortionLimit?: number,
    public controlRations: boolean = false,
    public dish?: Dish
  ){}

  public static isValidWeekDay(weekDay: any): weekDay is WeekDays {
    return this.validWeekDays.includes(weekDay);
  }

  static fromJson( object: {[key: string] : any} ): SchedDish {
    const { id, platilloId, cocinaId, diaSemana, /* racionesProgramadas,  */platillo, limiteRaciones, controlRaciones } = object;

    if (!diaSemana) throw CustomError.badRequest('Missing diaSemana');
    if (!SchedDish.isValidWeekDay(diaSemana)) throw CustomError.badRequest (`Invalid week day: ${diaSemana}, valid values: ${SchedDish.validWeekDays}`);
    if (!id) throw CustomError.badRequest('Missing id');
    if (!platilloId) throw CustomError.badRequest('Missing platilloId');
    if (!cocinaId) throw CustomError.badRequest('Missing cocinaId');
    if (limiteRaciones) {
      if (isNaN(limiteRaciones)) throw CustomError.badRequest('limiteRaciones must be a number');
      if (limiteRaciones < 0) throw CustomError.badRequest('limiteRaciones must be greater than 0');
    }
    if (controlRaciones !== undefined && typeof controlRaciones !== 'boolean') throw CustomError.badRequest('controlRaciones must be a boolean');
    // if (!racionesProgramadas) throw CustomError.badRequest('Missing racionesProgramadas');
    // if (typeof racionesProgramadas !== 'number') throw CustomError.badRequest('racionesProgramadas must be a number');
    // if (racionesProgramadas < 0) throw CustomError.badRequest('racionesProgramadas must be greater than 0');
    // Convertir el objeto platillo a una instancia de Dish si está presente
    const dish = platillo ? Dish.fromJson(platillo) : undefined;

    return new SchedDish( id, platilloId, cocinaId, diaSemana, limiteRaciones, controlRaciones, dish);
  }

}