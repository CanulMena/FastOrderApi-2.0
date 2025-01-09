import { User } from "../../entities";
import { DishRepository, DishSideRepository } from "../../repositories";

interface DeleteDishUseCase {
    execute(dishId: number, user: User): Promise<object>
}

export class DeleteDish implements DeleteDishUseCase {

    constructor(
        private dishRespository: DishRepository,
        private dishSideRepository: DishSideRepository
    ) {}

    async execute(dishId: number, user: User): Promise<object> {
        if (!dishId) throw new Error('Dish id is required');
        const dishFound = await this.dishRespository.getDishById(dishId);
        
        if (dishFound.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw new Error('User does not have access to this kitchen');
        }
        
        await this.dishSideRepository.deleteSidesByDishId(dishId);
        const dishDeleted = await this.dishRespository.deleteDish(dishId)
        return {
            dish: dishDeleted
        };
    }
}