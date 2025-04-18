import { Request, Response } from "express";
import { CreateSchedDishDto } from "../../domain/dtos";
import { CreateSchedDish } from "../../domain/use-cases/dish/create-sched-dish";
import { CustomError } from "../../domain/errors";
import { DishRepository, SchedDishRepository } from "../../domain/repositories";

export class SchedDishController {

  constructor(
    private readonly dishRepository: DishRepository,
    private readonly schedDishRepository: SchedDishRepository,
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public postSchedDish = async (req: Request, res: Response) => {

    const [error, schedDishDto] = CreateSchedDishDto.create(req.body);

    if( error ){
      res.status(400).json({ error });
      return;
    }

    new CreateSchedDish(
      this.schedDishRepository,
      this.dishRepository
    )
    .execute(schedDishDto!)
    .then( schedDish => res.status(200).json(schedDish))
    .catch( error => this.handleError(error, res));
  }
  
  //TODO: Crear un get para obtener los platillos programados de una cocina.

  //TODO: Actualizar los platillos programados

  //TODO: Eliminar platillos programados
}