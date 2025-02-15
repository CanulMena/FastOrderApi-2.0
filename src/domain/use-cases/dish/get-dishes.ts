import { PaginationDto } from "../../dtos";
import { Dish, User } from "../../entities";
import { CustomError } from "../../errors";
import { DishRepository } from "../../repositories";

interface GetDishesUseCase {
  execute(user: User, paginationDto: PaginationDto): Promise<object>;
}

export class GetDishes implements GetDishesUseCase {
  constructor(
    private readonly dishRepository: DishRepository
  ) {}

  async execute(user: User, paginationDto: PaginationDto): Promise<object> {
      const { page, limit } = paginationDto;
  
      if (user.rol === 'SUPER_ADMIN') {
        //TODO: Refactorizar esto para mejorar la velocidad e la consulta]
        const dishesCount = await this.dishRepository.getDishesCount();
        const dishes = await this.dishRepository.getDishes(paginationDto);
        return this.buildResponse(dishes, page, limit, dishesCount);
      }
  
      if (!user.kitchenId) {
        throw CustomError.unAuthorized('User does not have access to any kitchen');
      }
      
      //TODO: Refactorizar esto para mejorar la velocidad e la consulta
      const dishesByKitchenIdCount = await this.dishRepository.getDishesByKitchenIdCount(user.kitchenId);
      const dishesByKitchenId = await this.dishRepository.getDishesByKitchenId(user.kitchenId, paginationDto);
  
      return this.buildResponse(dishesByKitchenId, page, limit, dishesByKitchenIdCount);
    }
  
    private buildResponse(dishes: Dish[], page: number, limit: number, count: number): object {
      //TODO: VER COMO PUEDO REUTILIZAR ESTE CODIGO EN DIFERENTES LUGARES CON PAGINACIÓN
      return {
        page,
        limit,
        total: count,
        next: (page * limit) < count ? `/api/dish/get-all?page=${ (page + 1) }&limit=${ limit }` : null,
        prev: ( page - 1 > 0 ) ? `http://localhost:3000/dish/get-all?page=${ (page - 1) }&limit=${ limit }` : null,
        dishes: dishes,
        message: dishes.length === 0 ? 'No more dishes available for this query.' : null,
      };
    }
    
}