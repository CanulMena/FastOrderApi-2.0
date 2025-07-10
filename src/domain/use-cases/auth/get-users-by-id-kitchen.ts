import { PaginationDto } from "../../dtos";
import { UserRepository } from "../../repositories";
import { User } from '../../entities/user.entity';

interface GetCustomersByIdKitchenUseCase {
    execute(user: User, kitchenId: number, pagination: PaginationDto): Promise<object>;
}

export class GetUsersByIdKitchen implements GetCustomersByIdKitchenUseCase {
    constructor(
        private readonly  userRespository: UserRepository
    ) {}

    async execute(user: User, kitchenId: number, pagination: PaginationDto): Promise<object> {
        const { page, limit } = pagination;

        if (user.rol === 'SUPER_ADMIN') {
            const usersCount = await this.userRespository.getUsersByKitchenIdCount(kitchenId);
            const users = await this.userRespository.getUsersByKitchenId(kitchenId, pagination);
            return this.buildResponse(users, page, limit, usersCount);
        }
        if (!user.kitchenId) {
            throw new Error('User does not have access to any kitchen');
        }
        const usersByKitchenIdCount = await this.userRespository.getUsersByKitchenIdCount(user.kitchenId);
        const usersByKitchenId = await this.userRespository.getUsersByKitchenId(user.kitchenId, pagination);
        return this.buildResponse(usersByKitchenId, page, limit, usersByKitchenIdCount);

    }

    private buildResponse(user: User[], page: number, limit: number, count: number): object {
        const sanitizedUsers = user.map(({ passwordHash, ...rest}) => rest);
        return {
            page,
            limit,
            total: count,
            next: (page * limit) < count ? `/api/dish/get-all?page=${ (page + 1) }&limit=${ limit }` : null,
            prev: ( page - 1 > 0 ) ? `http://localhost:3000/dish/get-all?page=${ (page - 1) }&limit=${ limit }` : null,
            users: sanitizedUsers,
            message: user.length === 0 ? 'No more dishes available for this query.' : null,
        };
    }

}