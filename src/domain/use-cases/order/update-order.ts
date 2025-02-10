import { UpdateOrderDto } from "../../dtos";
import { OrderDetail, User } from "../../entities";
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
        //* Parte principal de la orden
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
            const customer = await this.customerRepository.getCustomerById(updateOrderDto.clientId!); //*le paso el id del cilente que quiero actualizar en el updateOrderDto
            
            // Verifica si el cliente pertenece a la cocina de la orden
            if ( customer.kitchenId !== orderFound.kitchenId) {
                throw CustomError.badRequest('The customer does not belong to the kitchen of the order');
            }
        } 

        //* Parte anidada de la orden (detalles de la orden)
        let orderDetailsByOrderId: OrderDetail[] = [];
        if (updateOrderDto.orderDetails && updateOrderDto.orderDetails.length > 0) {
            // 1. Obtenemos todos los detalles de orden de la orden existente.
            orderDetailsByOrderId = await this.orderRepository.getOrderDetailsByOrderId(orderFound.orderId);
    
            // 2. Obtenemos todos los dishId de los detalles de pedido que tenemos.
            const dishIds: number[] = orderDetailsByOrderId.map(detail => detail.dishId);
    
            // 3. Obtenemos todos los platillos de los detalles de pedido que tenemos.
            const dishes = await this.dishRepository.getDishesById(dishIds);
    
            // 4. Validar raciones disponibles antes de hacer cualquier actualización
            updateOrderDto.orderDetails.forEach(detail => {
            const existingDetail = orderDetailsByOrderId.find(d => d.orderDetailId === detail.orderDetailId);
            if (!existingDetail) {
                throw CustomError.badRequest(`Order detail ${detail.orderDetailId} not found`);
            }
    
            const requestedServings =
                detail.fullPortion !== undefined || detail.halfPortion !== undefined
                ? (detail.fullPortion ?? 0) + (detail.halfPortion ?? 0) * 0.5
                : (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
    
            const previousServings = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
            const dish = dishes.find(d => d.dishId === existingDetail.dishId);
            if (!dish) {
                throw CustomError.notFound(`Dish with id ${existingDetail.dishId} not found`);
            }
    
            const servingsDifference = requestedServings - previousServings;
            if (servingsDifference > 0 && servingsDifference > dish.availableServings) {
                throw CustomError.badRequest(`Not enough servings available for dish ${dish.name}`);
            }
            });
        }

        const orderUpdated = await this.orderRepository.updateOrder(updateOrderDto, orderDetailsByOrderId);

        return { orderUpdated };
    }
}