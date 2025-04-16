import { PrismaClient } from '@prisma/client';
import { CreateSchedDishDto } from "../../dtos";
import { SchedDish } from "../../entities";
import { CustomError } from '../../errors';
interface CreateSchedDishUseCase {
  execute(
    schedDishDto: CreateSchedDishDto
  ): Promise<{
    schedDish: SchedDish;
  }>
}

export class CreateSchedDish implements CreateSchedDishUseCase {
  
  constructor(){}
  
  async execute(schedDishDto: CreateSchedDishDto): Promise<{ schedDish: SchedDish }> {
    const prisma = new PrismaClient();

    //validar que el platillo existe y que pertenece a la cocina.
    const dish = await prisma.platillo.findUnique({ //TODO: AGREGAR REPOSITORIO Y DATASOURCE
      where: {
        id: schedDishDto.dishId
      }
    });

    if(!dish) {
      throw CustomError.notFound(
        `The dish with ID ${schedDishDto.dishId} does not exist.`
      );
    }

    //al ya haber validado que este platillo es de la misma cocina tambien valida que el usuario pertenece a esa cocina.
    if (dish!.cocinaId !== schedDishDto.kitchenId) {
      throw CustomError.unAuthorized(
        `The dish with ID ${schedDishDto.dishId} does not belong to the specified kitchen (ID: ${schedDishDto.kitchenId}).`
      );
    }

    // validar que no se pueda repetir platillos programados para la misma cocina y el mismo dia de la semana.
    const existingSchedDish = await prisma.platilloProgramado.findFirst({
      where: {
        cocinaId: schedDishDto.kitchenId, //la cocina
        diaSemana: schedDishDto.weekDay, //dia de la semana 
        platilloId: schedDishDto.dishId //platillo existente
      }
    })

    if (existingSchedDish) {
      throw CustomError.badRequest(
        `A scheduled dish for the same kitchen and day of the week already exists.`
      );
    }
    
     // Crear el platillo programado
    const scheduledDish = await prisma.platilloProgramado.create({ //TODO: AGREGAR REPOSITORIO Y DATASOURCE
      data: {
        platilloId: schedDishDto.dishId,
        cocinaId: schedDishDto.kitchenId,
        diaSemana: schedDishDto.weekDay,
        racionesProgramadas: schedDishDto.scheduledRations,
      },
    });

    

    return {
      schedDish: SchedDish.fromJson(scheduledDish),
    };
  }

}