import { RegisterCustomerDto } from "../../dtos/customer";
import { Customer } from "../../entities";
import { CustomerRepository, KitchenRepository } from "../../repositories";

interface CreateCustomerUseCase {
  execute(customer: Customer): Promise<object>;
}

export class CreateCustomer implements CreateCustomerUseCase {

  constructor( 
    private readonly kitchenRepositoryImpl: KitchenRepository,
    private readonly customerRepositoryImpl: CustomerRepository
  ) {}

  async execute( registerCustomerDto: RegisterCustomerDto ): Promise<object> {

    await this.kitchenRepositoryImpl.getKitchenById(registerCustomerDto.kitchenId);
    const customerCreated = await this.customerRepositoryImpl.registerCustomer(registerCustomerDto);

    return { 
      Customer: customerCreated 
    };
  }

}