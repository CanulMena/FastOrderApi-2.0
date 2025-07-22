import { Side, User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository, SideRepository } from "../../repositories";

interface GetDishUseCase {
    execute(dishId: number, user: User): Promise<object>;
}

export class GetDish implements GetDishUseCase {
    constructor(
        private readonly dishRespository: DishRepository, 
        private readonly sideRepository: SideRepository
    ) {}

    async execute(dishId: number, user: User): Promise<object> {
        if (!user.rol) throw CustomError.unAuthorized('User role is required');
        const dish = await this.dishRespository.getDishById(dishId);
        if (dish.kitchenId !== user.kitchenId && user.rol !== 'SUPER_ADMIN') {
            throw CustomError.unAuthorized('User does not have access to this kitchen');
        } 

        let sides: { id: number, name: string}[] = [];
        if (dish.sidesId && dish.sidesId.length > 0) {
            const sideEntities: Side[] = await this.sideRepository.getSidesByIds(dish.sidesId);
            sides = sideEntities.map(side => ({
                id: side.sideId, 
                name: side.name
            }));
        }
        return {
            ...dish, 
            sides, 
            // scheduledDays: dish.}
        }
    }

}