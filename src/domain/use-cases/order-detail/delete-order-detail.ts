import { User } from "../../entities";
import { OrderRepository } from '../../repositories/order.repository';
import { Order } from '../../entities/order.entity';
import { DishRepository } from "../../repositories";


interface DeleteOrderDetailUseCase {
    execute(orderDetailId: number ): Promise<object>;
}

export class DeleteOrderDetail implements DeleteOrderDetailUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private dishRepository: DishRepository
    ) {}

    async execute(orderDetailId: number): Promise<object> {
        const existingOrderDetail = await this.orderRepository.getOrderDetailById(orderDetailId);

        

        // TODO: Check if the dish is available to restore the servings
        // if (existingOrderDetail) {
        //     const servingToRestore = (existingOrderDetail.portion ?? 0) + (existingOrderDetail.halfPortion ?? 0) * 0.5;
        //     const dish = await this.dishRepository.getDishById(existingOrderDetail.dishId);
        //     if (dish) {
        //         await this.dishRepository.updateDish(dish.dishId, dish.availableServings + servingToRestore);
        //     }
        // }

        const orderDeleted = await this.orderRepository.deleteOrderDetail(orderDetailId);
        return {
            order: orderDeleted
        }
    }
}