import { Order, User } from '../../entities';
import { PaginationDto } from '../../dtos';
import { OrderRepository } from '../../repositories';
import { CustomError } from '../../errors';
import { envs } from '../../../configuration'


interface GetOrdersUseCase {
    execute(user: User, paginationDto: PaginationDto): Promise<object>;
}

export class GetOrders implements GetOrdersUseCase {
    constructor(
        private readonly orderRepositoy: OrderRepository
    ) {}

    async execute(user: User, paginationDto: PaginationDto): Promise<object> {
        const { page, limit } = paginationDto;

        if (user.rol === 'SUPER_ADMIN') {
            const ordersCount = await this.orderRepositoy.getOrdersCount();
            const orders = await this.orderRepositoy.getOrders(paginationDto);
            return this.buildResponse(orders, page, limit, ordersCount);
        }

        if (!user.kitchenId) {
            throw CustomError.unAuthorized('User does not have access to any kitchen');
        }

        const ordersByKitchenIdCount = await this.orderRepositoy.getOrdersByKitchenIdCount(user.kitchenId);
        const ordersByKitchenId = await this.orderRepositoy.getOrdersByKitchenId(user.kitchenId, paginationDto);

        return this.buildResponse(ordersByKitchenId, page, limit, ordersByKitchenIdCount);
    }

    private buildResponse(orders: Order[], page: number, limit: number, count: number): object {
        return {
            page,
            limit,
            total: count,
            next: (page * limit) < count ? `/api/dish/get-all?page=${ (page + 1) }&limit=${ limit }` : null,
            prev: ( page - 1 > 0 ) ? `${envs.WEB_SERVICE_URL}/dish/get-all?page=${ (page - 1) }&limit=${ limit }` : null,
            orders: orders,
            message: orders.length === 0 ? 'No more orders available for this query.' : null,
        };
    }
}