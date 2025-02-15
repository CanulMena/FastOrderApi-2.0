import { OrderRepository } from '../../repositories/order.repository';
import { DishRepository } from "../../repositories";
import { UpdateDishDto } from "../../dtos";
import { CustomError } from '../../errors';

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
        if (existingOrderDetail) {
            const servingToRestore = (existingOrderDetail.portion ?? 0) + (existingOrderDetail.halfPortion ?? 0) * 0.5;
            const dish = await this.dishRepository.getDishById(existingOrderDetail.dishId);
            
            const newAvailableServings = dish.availableServings + servingToRestore;
            const [error, updateDishDto] = UpdateDishDto.create({
                availableServings: newAvailableServings, 
                dishId: dish.dishId
            })

            if (error) {
                throw new Error(error);
            }

            const updateDish = await this.dishRepository.updateDish(updateDishDto!);
            if (!updateDish) {
                throw CustomError.badRequest(`Dish with id ${dish.dishId} could not be updated`);
            }
        }

        const orderDeleted = await this.orderRepository.deleteOrderDetail(orderDetailId);
        return {
            order: orderDeleted
        }
    }
}