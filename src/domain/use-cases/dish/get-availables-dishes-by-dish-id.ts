import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SchedDishRepository } from "../../repositories";

interface GetAvailableDishesByDishIdUseCase {
    execute( dishId: number, user: User ): Promise<object>;
}

export class GetAvailableDishesByDishId implements GetAvailableDishesByDishIdUseCase {
    constructor (
        readonly schedDishRepository: SchedDishRepository,
    ) {}

    async execute(dishId: number, user: User): Promise<object> {
        if (!user.kitchenId) {
            throw CustomError.badRequest('User does not have access to any kitchen');
        }
        
        if (user.rol !== 'ADMIN') {
            throw CustomError.forbidden('User does not have permission to access this resource');
        }

        const scheduledDishes = await this.schedDishRepository.findAllSchedDishByDishId(dishId);
        const result = scheduledDishes.map(schedDish => ({
            id: schedDish.id,
            dishId: schedDish.dishId,
            weekDay: schedDish.weekDay
        }));
        return { scheduledDishes: result };
    }
}