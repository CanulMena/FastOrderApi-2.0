import { Request, Response } from "express";
import { CreateSchedDishDto } from "../../domain/dtos";
import { CreateSchedDish } from "../../domain/use-cases/dish/create-sched-dish";
import { CustomError } from "../../domain/errors";
import { DishRepository, SchedDishRepository, OrderRepository } from "../../domain/repositories";
import { GetAvailableDishes } from '../../domain/use-cases/dish/get-available-dishes';
import { User } from "../../domain/entities";
import { GetAvailableDishesForWeek } from "../../domain/use-cases/dish/get-availables-dishes-for-week";
import { GetAvailableDishesByDishId } from "../../domain/use-cases/dish/get-availables-dishes-by-dish-id";

export class SchedDishController {

  constructor(
    private readonly dishRepository: DishRepository,
    private readonly schedDishRepository: SchedDishRepository,
    private readonly orderRepository: OrderRepository,
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

  public getAvailableDishes = async (req: Request, res: Response) => {
    
    const user = req.body.user as User;

    new GetAvailableDishes(
      this.schedDishRepository,
      this.orderRepository
    )
    .execute(user)
    .then( availableDishes => res.status(200).json(availableDishes))
    .catch( error => this.handleError(error, res));

  }

  public getAvailableDishesForWeek = async (req: Request, res: Response) => {
    const user = req.body.user as User;

    new GetAvailableDishesForWeek(this.schedDishRepository)
    .execute(user)
    .then(availableDishes => res.status(200).json(availableDishes))
    .catch( error => this.handleError(error, res) );
  }

  public getSchedDishesByDishId = async (req: Request, res: Response) => {
    const dishId = +req.params.dishId;
    const user = req.body.user as User;

    if ( isNaN(dishId) ) {
      res.status(400).json({error: 'ID argument is not a number'});
      return;
    }

    new GetAvailableDishesByDishId(this.schedDishRepository)
    .execute(dishId, user)
    .then( schedDishes => res.status(200).json(schedDishes))
    .catch( error => this.handleError(error, res) );
  }

  //TODO: Actualizar los platillos programados

  //TODO: Eliminar platillos programados
}