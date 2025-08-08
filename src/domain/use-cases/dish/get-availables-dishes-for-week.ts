import { User } from "../../entities";
import { CustomError } from "../../errors";
import { SchedDishRepository } from "../../repositories";

interface GetAvailableDishesForWeekUseCase {
    execute( user: User): Promise<object>;
}

export class GetAvailableDishesForWeek implements GetAvailableDishesForWeekUseCase {
    constructor(
        private readonly schedDishRepository: SchedDishRepository,
    ) {}

    async execute(user: User): Promise<object> {

        // Verificamos que el usuario tenga una cocina asignada
        if (!user.kitchenId) {
            throw CustomError.badRequest('User does not have a kitchen assigned');
        }
        // Obtenemos todos los platos programados para la semana de la cocina del usuario
        const allSchedDishes = await this.schedDishRepository.findAllSchedDishByKitchenForWeek(user.kitchenId!);
        // Lo que vamos a hacer es agrupar los platos por día de la semana para ello primeero definimos el tipo de dato que sera el resultado
        const groupedByDay: Record<string, {id: number, dishId: number, name: string}[]> = {};
        // Iteramos sobre los platos programados y los agrupamos por día de la semana
        allSchedDishes.forEach(({ id, weekDay, dish}) => {
            // Si el día de la semana no existe en el objeto agrupado, lo inicializamos
            if (!groupedByDay[weekDay]) groupedByDay[weekDay] = [];
            // Agregamos el plato al día correspondiente
            groupedByDay[weekDay].push({
                id: id, 
                dishId: dish?.dishId || 0,
                name: dish?.name || 'Unknown Dish'
            });
        });
        // Retornamos el objeto agrupado por día de la semana
        // El objeto tendrá la forma { lunes: [...], martes: [...], ... }
        return { dia: groupedByDay };
    }
}