import { Request, Response } from 'express';
import { DishRepository } from '../../domain/repositories';
import { CreateDishDto } from '../../domain/dtos/dish/create-dish.dto';
import { CustomError } from '../../domain/errors';
import { CreateDish } from '../../domain/use-cases/dish/index';

export class DishController {

  constructor(
    private dishRepositoryImpl: DishRepository,
  ) {}

  private handleError(error: unknown, res: Response) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.log(`${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
  }

  public postDish = async (req: Request, res: Response) => {
    const [error, dishDto] = CreateDishDto.create(req.body);

    if (error) {
      res.status(400).json({error});
      return;
    }
    
    new CreateDish(this.dishRepositoryImpl)
    .execute(dishDto!)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }
}