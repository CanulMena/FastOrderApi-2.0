import { CustomerRepository, UserRepository } from "../../repositories";
import { PaginationDto } from '../../dtos/shared/pagination.dto';
import { Customer, User } from "../../entities";

interface GetCustomersByIdKitchenUseCase {
    execute(user: User ,kitchenId: number, pagination: PaginationDto): Promise<object>;
}

export class GetCustomersByIdKitchen implements GetCustomersByIdKitchenUseCase {
    constructor(
        private readonly customerRepository: CustomerRepository,
    ) {}

    async execute(user: User, kitchenId: number, pagination: PaginationDto): Promise<object> {
        const { page, limit } = pagination;

        if (user.rol === 'SUPER_ADMIN') {
            const customersCount = await this.customerRepository.getCustomersByKitchenIdCount(kitchenId);
            const customers = await this.customerRepository.getCustomersByKitchenId(kitchenId, pagination);
            return this.buildResponse(customers, page, limit, customersCount);
        }

        if (!user.kitchenId) {
            throw new Error('User does not have access to any kitchen');
        }

        const customersByKitchenIdCount = await this.customerRepository.getCustomersByKitchenIdCount(user.kitchenId);
        const customersByKitchenId = await this.customerRepository.getCustomersByKitchenId(user.kitchenId, pagination);

        return this.buildResponse(customersByKitchenId, page, limit, customersByKitchenIdCount);
    
    }

    private buildResponse(customers: Customer[], page: number, limit: number, count: number): object {
        return {
            page,
            limit,
            total: count,
            next: (page * limit) < count ? `/api/dish/get-all?page=${ (page + 1) }&limit=${ limit }` : null,
            prev: ( page - 1 > 0 ) ? `http://localhost:3000/dish/get-all?page=${ (page - 1) }&limit=${ limit }` : null,
            customers: customers,
            message: customers.length === 0 ? 'No more dishes available for this query.' : null,
        };
    }
}