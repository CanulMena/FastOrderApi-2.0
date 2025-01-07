import { Request, Response } from 'express';
import { DishRepository, DishSideRepository } from '../../domain/repositories';
import { PaginationDto, CreateDishDto } from '../../domain/dtos';
import { CustomError } from '../../domain/errors';
import { CreateDish, GetDishes, GetDish, DeleteDish, GetSide } from '../../domain/use-cases/index';
import { User } from '../../domain/entities';

export class DishController {

  constructor(
    private dishRepository: DishRepository,
    private dishSideRepository: DishSideRepository,
    private getSide: GetSide
  ) {}

  private handleError(error: unknown, res: Response) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.log(`${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
  }

  public postDish = async (req: Request, res: Response) => {
    const user = req.body.user as User;
    const [error, dishDto] = CreateDishDto.create(req.body);

    if (error) {
      res.status(400).json({error});
      return;
    }
    
    new CreateDish(this.dishRepository, this.getSide)
    .execute(dishDto!, user)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }

  public getDishById = (req: Request, res: Response ) => {
    const dishId = +req.params.dishId;
    const user = req.body.user as User;

    if ( isNaN(dishId) ) {
      res.status(400).json({error: 'ID argument is not a number'});
    }

    new GetDish(this.dishRepository)
    .execute(dishId, user)
    .then( dish => res.status(200).json(dish))
    .catch( error => this.handleError(error, res));
  }

  public getDishes = (req: Request, res: Response) => {
    const user = req.body.user as User;
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if( error ){
        res.status(400).json({error});
        return;
    }
    
    new GetDishes(this.dishRepository)
    .execute(user, paginationDto!)
    .then( dishes => res.status(200).json(dishes))
    .catch( error => this.handleError(error, res));
  }

  public deleteDish = (req: Request, res: Response) => {
    const dishId = +req.params.dishId;
    const user = req.body.user as User;

    if (isNaN(dishId)) {
      res.status(400).json({error: 'ID argument is not a number'});
    }

    new DeleteDish(this.dishRepository, this.dishSideRepository)
    .execute(dishId, user)
    .then( dish => res.status(200).json(dish))
    .catch( error => this.handleError(error, res));
  }
}