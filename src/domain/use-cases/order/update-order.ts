import { UpdateOrderDto } from "../../dtos";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { CustomerRepository, DishRepository, OrderRepository } from "../../repositories";


interface UpdateOrderUseCase {
    execute(updateOrderDto: UpdateOrderDto, user: User): Promise<Object>;
}

export class UpdateOrder implements UpdateOrderUseCase {
    constructor (
        private readonly orderRepository: OrderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly dishRepository: DishRepository
        
    ) {}

    async execute(updateOrderDto: UpdateOrderDto, user: User): Promise<Object> {
        // Verifica si la orden existe
        const orderFound = await this.orderRepository.getOrderById(updateOrderDto.orderId);
        // Verifica si el usuario tiene acceso a la cocina de la orden
        if (orderFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw CustomError.unAuthorized('User does not have access to this kitchen');
        }

        // Validar que el status de la orden que se quiere actualizar no sea entregado
        if (orderFound.status === 'ENTREGADO') {
            throw CustomError.badRequest('The order has already been delivered');
        }

        // Verificar que se quiere actualizar al cliente de la orden
        if (updateOrderDto.clientId) { 
            // Verifica si el cliente existe
            const customer = await this.customerRepository.getCustomerById(updateOrderDto.clientId!);
            
            // Verifica si el cliente pertenece a la cocina de la orden
            if ( customer.kitchenId !== orderFound.kitchenId) {
                throw CustomError.badRequest('The customer does not belong to the kitchen of the order');
            }
        }

        //quiero validar que si order details no es nulo y tiene elementos entonces se ejecute el siguiente bloque
        if (updateOrderDto.orderDetails?.length) { //* actualiza los detalles de la orden  y las raciones disponibles de los platillos
            for (const detail of updateOrderDto.orderDetails) {
                //1.- Verficar que el detalle exista si lo voy a actualizar.
                const orderDetail = await this.orderRepository.getOrderDetailById(detail.orderDetailId);

                const requestServings = (detail.fullPortion ?? 0) + (detail.halfPortion ?? 0) * 0.5;

                const dish = await this.dishRepository.getDishById(orderDetail.dishId);

                if (dish.kitchenId !== orderFound.kitchenId) {
                    throw CustomError.badRequest(`Dish with id ${detail.dishId} does not belong to the kitchen of the order`);
                }

                if (requestServings > dish.availableServings) {
                    throw CustomError.badRequest(`There are not enough servings available for dish ${dish.name}`);
                }

                dish.availableServings -= requestServings;
                await this.dishRepository.updateDish(dish);
            }   
        }
            //TODO: Validar que pasa si se elimino un detalle del pedido
            //TODO: Tambien validar Si se elimina un detalle, restaurar las raciones disponibles

        // Actualiza la orden
        //TODO: verificar que si falla la actualización de la orden, se restauren las raciones disponibles de los platillos
        const orderUpdated = await this.orderRepository.updateOrder(updateOrderDto);
        


        return { orderUpdated };
    }
}