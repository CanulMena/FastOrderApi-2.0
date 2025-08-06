import { OrderRepository } from '../../repositories/order.repository';
import { DishRepository } from "../../repositories";
import { CreateOrderDetailsDto } from "../../dtos";
import { CustomError } from "../../errors";


interface CreateOrderDetailUseCase {
    execute(orderDetail: CreateOrderDetailsDto ): Promise<object>;
}

export class CreateOrderDetail implements CreateOrderDetailUseCase {
    constructor(
        private orderRepository: OrderRepository,
        // private dishRepository: DishRepository, TODO: PEDIR SCHED DISH
    ) {}

    async execute(orderDetail: CreateOrderDetailsDto): Promise<object> {

        //TODO: Cuando el control de raciones de PlatilloProgramado este activo. Validar que orderPortion no sea mayor al limiteRaciones de PlatilloProgramado
        // await this.orderRepository.getOrderById(orderDetail.orderId!);
        
        // const dish = await this.dishRepository.getDishById(orderDetail.dishId);

        // const requestServings = (orderDetail.fullPortion ?? 0) + (orderDetail.halfPortion ?? 0) * 0.5;

        // if (requestServings > dish.availableServings) {
        //     throw CustomError.badRequest('Dish does not have enough available servings');
        // }

        const orderDetailCreated = await this.orderRepository.createOrderDetail(orderDetail);
        return {
            orderDetail: orderDetailCreated
        }
    }
}