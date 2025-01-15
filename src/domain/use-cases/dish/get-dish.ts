import { User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository } from "../../repositories";

interface GetDishUseCase {
    execute(dishId: number, user: User): Promise<object>;
}

export class GetDish implements GetDishUseCase {
    constructor(private readonly dishRespository: DishRepository) {}

    async execute(dishId: number, user: User): Promise<object> {
        if (!user.rol) throw CustomError.unAuthorized('User role is required');
        const dish = await this.dishRespository.getDishById(dishId);
        if (dish.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw CustomError.unAuthorized('User does not have access to this kitchen');
        } 
        return {
            dish: dish
        }
    }

}