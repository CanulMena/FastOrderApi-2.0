import { User } from "../../entities";
import { DishRepository } from "../../repositories";

interface DeleteDishUseCase {
    execute(dishId: number, user: User): Promise<object>
}

export class DeleteDish implements DeleteDishUseCase {

    constructor(private dishRespository: DishRepository,
    ) {}

    async execute(dishId: number, user: User): Promise<object> {
        if (!dishId) throw new Error('Dish id is required');
        const dishFound = await this.dishRespository.getDishById(dishId);
        const dishSide = await this.dishRespository.deleteDishSide(dishId);
        if (!dishSide) {
            throw new Error('Dish side not found');
        }
        if (dishFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw new Error('User does not have access to this kitchen');
        }
        if (dishSide) {
            throw new Error('Dish side is eliminated');
        }
        const dishDeleted = await this.dishRespository.deleteDish(dishId)
        return {
            dish: dishDeleted
        }
    }
}