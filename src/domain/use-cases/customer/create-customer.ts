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

    //TODO: Validar que solo un ADMIN o SUPER_ADMIN pueda registrar un Customer
    await this.kitchenRepositoryImpl.getKitchenById(registerCustomerDto.kitchenId);
    const customerCreated = await this.customerRepositoryImpl.registerCustomer(registerCustomerDto);

    return { 
      Customer: customerCreated 
    };
  }

}