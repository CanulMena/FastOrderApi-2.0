import { User } from "../../entities";
import { OrderRepository } from "../../repositories";

interface DeleteOrderUseCase {
    execute(orderId: number, user: User): Promise<object>;
}

export class DeleteOrder implements DeleteOrderUseCase {
    constructor(
        private orderRepository: OrderRepository
    ) {}

    async execute(orderId: number, user: User): Promise<object> {
        if (!orderId) throw new Error('Order id is required');
        const orderFound = await this.orderRepository.getOrderById(orderId);

        if (orderFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw new Error('User does not have access to this kitchen');
        }


        const orderDeleted = await this.orderRepository.deleteOrder(orderId);
        return {
            order: orderDeleted
        }
    }   
}