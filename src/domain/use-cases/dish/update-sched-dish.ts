import { UpdateSchedDishDto } from "../../dtos";
import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SchedDishRepository } from "../../repositories";

interface UpdateSchedDishUseCase {
    execute(user: User, schedDishDto: UpdateSchedDishDto): Promise<object>;
}

export class UpdateSchedDish implements UpdateSchedDishUseCase {
    constructor(
        readonly schedDishRepository: SchedDishRepository,
    ) {}

    async execute( user: User, schedDishDto: UpdateSchedDishDto) {
        if (!user.kitchenId) {
            throw CustomError.badRequest('User has no kitchen assigned');
        }

        if (user.rol !== "ADMIN") {
            throw CustomError.forbidden('User is not authorized to update this dish');
        }

        const updatedDish = await this.schedDishRepository.updateSchedDish(schedDishDto);
        return { message: 'Dish updated successfully', dish: updatedDish };
    }
}