import { SchedDishRepository } from "../../repositories";

interface DeleteSchedDishUseCase {
    execute(schedDishId: number): Promise<object>;
}

export class DeleteSchedDish implements DeleteSchedDishUseCase {
    constructor(private schedDishRepository: SchedDishRepository) {}

    async execute(schedDishId: number): Promise<object> {
        const schedDishDeleted = await this.schedDishRepository.deleteSchedDish(schedDishId);
        return {
            schedDish: schedDishDeleted
        }
    }
}