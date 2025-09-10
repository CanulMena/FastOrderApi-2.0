import { Request, Response } from 'express';
import { CustomError } from "../../domain/errors";
import { User } from "../../domain/entities";
import { CreateOrderDetailsDto, CreateOrderDto, UpdateOrderDto, PaginationDto, OrderFiltersDto } from "../../domain/dtos";
import { RegisterOrder, UpdateOrder, DeleteOrder, GetOrders, DeleteOrderDetail, CreateOrderDetail, GetOrdersDay } from "../../domain/use-cases/index";
import { CustomerRepository, DishRepository, OrderRepository } from "../../domain/repositories";

export class OrderController {

  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository, 
    private dishRepository: DishRepository
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

    new RegisterOrder(
      this.orderRepository, 
      this.customerRepository,
      this.dishRepository
    )
    .execute(orderDto!)
    .then( order => res.status(201).json(order) ) // 201 Created
    .catch( error => this.handleError(error, res));

  }

  public getOrderById = (req: Request, res: Response) => {
    const orderId = +req.params.orderId;

    if( isNaN(orderId) ){
        res.status(400).json({error: 'ID argument is not a number' }); //? 400 Bad Request
    }

    this.orderRepository.getOrderById(orderId)
    .then( order => res.status(200).json(order) ) //? 200 OK
    .catch( error => this.handleError(error, res));
  }

  public updateOrder = (req: Request, res: Response) => {
    const orderId = +req.params.orderId;
    const user = req.body.user as User;
    const [error , updateOrderDto] = UpdateOrderDto.create({orderId, ...req.body});

    if (error) {
        res.status(400).json({error}); // 400 Bad Request
        return;
    }

    new UpdateOrder(this.orderRepository, this.customerRepository, this.dishRepository)
    .execute(updateOrderDto!, user)
    .then( order => res.status(200).json(order) ) // 200 OK
    .catch( error => this.handleError(error, res));
  }

  public deleteOrder = (req: Request, res: Response) => {
    const orderId = +req.params.orderId;
    const user = req.body.user as User;

    if (isNaN(orderId)) {
      res.status(400).json({error: 'ID argument is not a number'});
    }

    new DeleteOrder(this.orderRepository)
    .execute(orderId, user)
    .then( order => res.status(200).json(order))
    .catch( error => this.handleError(error, res));
  }

  public createOrderDetail = (req: Request, res: Response) => { //FIXME: PEDIR EL ORDER ID COMO PARAMETRO
    const [error, orderDetailDto] = CreateOrderDetailsDto.create(req.body);

    if (error) {
        res.status(400).json({error});
        return;
    }

    new CreateOrderDetail(this.orderRepository/* , this.dishRepository */)
    .execute(orderDetailDto!)
    .then( orderDetail => res.status(201).json(orderDetail))
    .catch( error => this.handleError(error, res));
  }

  public deleteOrderDetail = (req: Request, res: Response) => {
    const orderDetailId = +req.params.orderDetailId;
    const user = req.body.user as User;

    if (isNaN(orderDetailId)) {
      res.status(400).json({error: 'ID argument is not a number'});
    }

    new DeleteOrderDetail(this.orderRepository, this.dishRepository)
    .execute(orderDetailId)
    .then( order => res.status(200).json(order))
    .catch( error => this.handleError(error, res));
  }

  public getOrders = (req: Request, res: Response) => {
    const user = req.body.user as User;
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) {
      res.status(400).json({error});
      return;
    }

    new GetOrders(this.orderRepository)
    .execute(user, paginationDto!)
    .then( orders => res.status(200).json(orders))
    .catch( error => this.handleError(error, res));
  }

  public getOrdersDay = (req: Request, res: Response) => {
    const user = req.body.user as User;
    const { page = 1, limit = 10, orderStatus, paymentType, orderType } = req.query;
    const [paginationError, paginationDto] = PaginationDto.create(+page, +limit);

    if (paginationError) {
      res.status(400).json({error: paginationError});
      return;
    }

    const [filterError, filterDto] = OrderFiltersDto.create({ orderStatus, paymentType, orderType });
    if (filterError) {
      res.status(400).json({error: filterError});
      return;
    }

    new GetOrdersDay(
      this.orderRepository,
      this.customerRepository,
      this.dishRepository
    )
    .execute(user, paginationDto!, filterDto!)
    .then( orders => res.status(200).json(orders))
    .catch( error => this.handleError(error, res));
  }
}