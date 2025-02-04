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

        // Validar la actualización de los detalle de la orden ---> si existe ese detalle de orden, podemos actualizarlo o interactuar con ese detalle de orden.
        if (updateOrderDto.orderDetails) {
            for (const detail of updateOrderDto.orderDetails) {
                //1.- Verficar que el detalle exista
                const orderDetail = await this.orderRepository.getOrderDetailById(detail.orderDetailId);

                //2.- Verificar que el platillo sea valido para la cocina
                const dish = await this.dishRepository.getDishById(detail.dishId!)
                if (dish.kitchenId !== orderFound.kitchenId) {
                    throw CustomError.badRequest(`Dish with id ${detail.dishId} does not belong to the kitchen of the order`);
                }

                const requestServings = (detail.fullPortion ?? 0) + (detail.halfPortion ?? 0) * 0.5;

                if (requestServings > dish.availableServings) {
                    throw CustomError.badRequest(`There are not enough servings available for dish ${dish.name}`);
                }

                // 5.- Actualizar las raciones disponibles del platillo
                dish.availableServings -= requestServings;
                await this.dishRepository.updateDish(dish);

                // Si el detalle se elimina, continuar con la siguiente iteración ---validar la eliminaciónn de un platillo
                if (detail.isDelete) {
                    continue;
                }


                // 6.- Si se elimina un detalle, restaurar las raciones disponibles
            }   
        }

            //TODO:  Validar si quiero eliminar el detalle o solo actualizarlo ---Poner el delete como true o false
            //TODO: Validar que pasa si se elimino un detalle del pedido
            //TODO: Tambien validar Si se elimina un detalle, restaurar las raciones disponibles


        // Actualiza la orden
        const orderUpdated = await this.orderRepository.updateOrder(updateOrderDto);

        return { orderUpdated };
    }
}