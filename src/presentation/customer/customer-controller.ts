import { Request, Response } from 'express';
import { CustomerRepository, KitchenRepository } from '../../domain/repositories';
import { RegisterCustomerDto } from '../../domain/dtos/customer';
import { CreateCustomer } from '../../domain/use-cases/customer/create-customer';
import { CustomError } from '../../domain/errors';
import { PaginationDto } from '../../domain/dtos';
import { GetCustomersByIdKitchen } from '../../domain/use-cases';
import { User } from '../../domain/entities';

export class CustomerController{

  constructor(
    private readonly kitchenRepository: KitchenRepository,
    private readonly customerRepository: CustomerRepository
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  public postCustomer = (req: Request, res: Response) => {//POST /api/customer
    const { name, phone, address, kitchenId } = req.body;
    const [error, registerCustomerDto] = RegisterCustomerDto.create({ name, phone, address, kitchenId });
    if(error){
      res.status(400).json({ error: error });
      return;
    }
    new CreateCustomer(
      this.kitchenRepository,
      this.customerRepository
    )
    .execute(registerCustomerDto!)
    .then((customer) => res.status(201).json(customer))
    .catch((err) => this.handleError(err, res));
  }

  public getCustomersByIdKitchen = (req: Request, res: Response) => {
    const user = req.body.user as User;
    const kitchenId = +req.params.kitchenId;
    const search = req.query.search;
    const {page = 1, limit = 10} = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new GetCustomersByIdKitchen(this.customerRepository)
    .execute(user, kitchenId, paginationDto!, search ? String(search) : undefined)
    .then((customers) => res.status(200).json(customers))
    .catch((err) => this.handleError(err, res));
  }
}