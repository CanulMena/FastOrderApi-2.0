import { PrismaClient } from "@prisma/client";
import { SchedDishDatasource } from "../../domain/datasource/sched-dish.datasource";
import { CreateSchedDishDto, UpdateSchedDishDto } from "../../domain/dtos";
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
        limiteRaciones: schedDish.SchedDishPortionLimit,
        controlRaciones: schedDish.controlRations,
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

  async findAllSchedDishByKitchenForWeek(kitchenId: number): Promise<SchedDish[]> {
    const scheduledDishes = await this.prismaSchedDish.findMany({
      where: {
        cocinaId: kitchenId,
      },
      include: {
        platillo: true,
      }
    });

    return scheduledDishes.map((schedDish) => SchedDish.fromJson(schedDish));
  }

  async findAllSchedDishByDishId(dishId: number): Promise<SchedDish[]> {
    const scheduledDishes = await this.prismaSchedDish.findMany({
      where: {
        platilloId: dishId, 
      }, 
      include: {
        platillo: true,
      }
    });

    return scheduledDishes.map((schedDish) => SchedDish.fromJson(schedDish)); 
  }

    async getSchedDishById(schedDishId: number): Promise<SchedDish> {
    const scheduledDish = await this.prismaSchedDish.findUnique({
      where: {
        id: schedDishId,
      },
      include: {
        platillo: true,
      }
    });

    if (!scheduledDish) throw CustomError.notFound(`Scheduled dish with ID ${schedDishId} not found.`);

    return SchedDish.fromJson(scheduledDish);
  }
  
  async updateSchedDish( updateSchedDish: UpdateSchedDishDto ): Promise<SchedDish> {
    await this.getSchedDishById(updateSchedDish.id);
    const updatedSchedDish = await this.prismaSchedDish.update({
      where: {
        id: updateSchedDish.id
      },
      data: {
        diaSemana: updateSchedDish.weekDay,
      }, 
      include: {
        platillo: true,
      }
    });

    return SchedDish.fromJson(updatedSchedDish);
  }

  async deleteSchedDish( schedDishId: number ): Promise<SchedDish> {
    await this.getSchedDishById( schedDishId );

    const deletedSchedDish = await this.prismaSchedDish.delete({
      where: {
        id: schedDishId
      },
    });

    return SchedDish.fromJson(deletedSchedDish);
  }
}