import { OrderDetail, User } from "../../entities";
import { CustomError } from "../../errors";
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
            throw CustomError.unAuthorized('User does not have access to this kitchen');
        }

        // Obtener los detalles del pedido para restaurar las raciones
        const orderDetailsByOrderId: OrderDetail[] = await this.orderRepository.getOrderDetailsByOrderId(orderFound.orderId);

        const orderDeleted = await this.orderRepository.deleteOrder(orderId, orderDetailsByOrderId);
        return {
            order: orderDeleted
        }
    }   
}