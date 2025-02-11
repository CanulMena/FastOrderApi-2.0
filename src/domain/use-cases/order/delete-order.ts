import { OrderDetail, User } from "../../entities";
import { DishRepository, OrderRepository } from "../../repositories";

interface DeleteOrderUseCase {
    execute(orderId: number, user: User): Promise<object>;
}

export class DeleteOrder implements DeleteOrderUseCase {
    constructor(
        private orderRepository: OrderRepository, 
        // private dishRepository: DishRepository,
    ) {}

    async execute(orderId: number, user: User): Promise<object> {
        const orderFound = await this.orderRepository.getOrderById(orderId);

        if (orderFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw new Error('User does not have access to this kitchen');
        }

        const orderDetailsByOrderId: OrderDetail[] = await this.orderRepository.getOrderDetailsByOrderId(orderFound.orderId);



        const orderDeleted = await this.orderRepository.deleteOrder(orderId, orderDetailsByOrderId);
        return {
            order: orderDeleted
        }
    }   
}