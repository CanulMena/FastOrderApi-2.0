import { CreateOrderDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import { Request, Response } from 'express';
import { OrderRepository } from "../../domain/repositories";
import { RegisterOrder } from "../../domain/use-cases";

export class OrderController {

  constructor(
    private orderRepository: OrderRepository
  ) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public registerOrder = (req: Request, res: Response) => { //POST /api/order

    const [error, orderDto] = CreateOrderDto.create(req.body);

    if (error) {
        res.status(400).json({error}); // 400 Bad Request
        return;
    }

    new RegisterOrder(this.orderRepository)
    .execute(orderDto!)
    .then( order => res.status(201).json(order) ) // 201 Created
    .catch( error => this.handleError(error, res));

  }

}