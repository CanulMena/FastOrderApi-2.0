import { PrismaClient } from "@prisma/client";
import { SchedDishDatasource } from "../../domain/datasource/sched-dish.datasource";
import { CreateSchedDishDto } from "../../domain/dtos";
import { SchedDish, WeekDays } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class PostgresSchedDishDataSourceImpl implements SchedDishDatasource {

  private readonly prisma = new PrismaClient();
  private readonly prismaSchedDish = this.prisma.platilloProgramado;

  async createSchedDish(schedDish: CreateSchedDishDto): Promise<SchedDish> {

    const scheduledDish = await this.prismaSchedDish.create({
      data: {
        platilloId: schedDish.dishId,
        cocinaId: schedDish.kitchenId,
        diaSemana: schedDish.weekDay,
        racionesProgramadas: schedDish.scheduledRations,
      }
    });

    return SchedDish.fromJson(scheduledDish);
  }

  async findSchedDish(schedDish: CreateSchedDishDto): Promise<null> {

    const scheduledDish = await this.prismaSchedDish.findFirst({
      where: {
        cocinaId: schedDish.kitchenId,
        diaSemana: schedDish.weekDay,
        platilloId: schedDish.dishId,
      }
    });

    if (scheduledDish) throw CustomError.notFound(`A scheduled dish for the same kitchen and day of the week already exists.`);

    return scheduledDish;
  }

  async findScheduledDishesByDay(weekDay: WeekDays): Promise<SchedDish[]> {
    const scheduledDishes = await this.prismaSchedDish.findMany({
      where: {
        diaSemana: weekDay,
      },
      include: {
        platillo: true,
      }
    });

    if( scheduledDishes.length === 0) throw CustomError.notFound(`No scheduled dishes found for the day ${weekDay}.`);

    return scheduledDishes.map((schedDish) => SchedDish.fromJson(schedDish));
  }

  async findAllSchedDishByKitchen(kitchenId: number, weekDay: WeekDays): Promise<SchedDish[]> {
    const scheduledDishes = await this.prismaSchedDish.findMany({
      where: {
        diaSemana: weekDay,
        cocinaId: kitchenId,
      },
      include: {
        platillo: true,
      }
    });

    if( scheduledDishes.length === 0) throw CustomError.notFound(`No scheduled dishes found for the kitchen with ID ${kitchenId}.`);

    return scheduledDishes.map((schedDish) => SchedDish.fromJson(schedDish));
  }

}