import { UpdateOrderDto } from "../../dtos";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { CustomerRepository, OrderRepository } from "../../repositories";
import { Customer } from '../../entities/customer.entity';


interface UpdateOrderUseCase {
    execute(updateOrderDto: UpdateOrderDto, user: User): Promise<Object>;
}

export class UpdateOrder implements UpdateOrderUseCase {
    constructor (
        private readonly orderRepository: OrderRepository,
        private readonly customerRepository: CustomerRepository
        
    ) {}

    async execute(updateOrderDto: UpdateOrderDto, user: User): Promise<Object> {
        // Verifica si la orden existe
        const orderFound = await this.orderRepository.getOrderById(updateOrderDto.orderId);

        // Verifica si el usuario tiene acceso a la cocina de la orden
        if (orderFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw CustomError.unAuthorized('User does not have access to this kitchen');
        }

        // Verificar que se quiere actualizar al cliente de la orden
        if (updateOrderDto.clientId) { 
            // Verifica si el cliente existe
            const customer = await this.customerRepository.getCustomerById(updateOrderDto.clientId!);
            if (!customer) {
                throw CustomError.notFound(`Customer with id ${updateOrderDto.clientId} does not exist`);
            }
            // Verifica si el cliente pertenece a la cocina de la orden
            if ( customer.kitchenId !== orderFound.kitchenId) {
                throw CustomError.badRequest('The customer does not belong to the kitchen of the order');
            }
        }


        // Actualiza la orden
        const orderUpdated = await this.orderRepository.updateOrder(updateOrderDto);

        return { orderUpdated };
    }
}