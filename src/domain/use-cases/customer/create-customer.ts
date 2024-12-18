import { RegisterCustomerDto } from "../../dtos/customer";
import { Customer } from "../../entities";
import { CustomerRepository } from "../../repositories";

interface CreateCustomerUseCase {
  execute(customer: Customer): Promise<object>;
}

export class CreateCustomer implements CreateCustomerUseCase {

  constructor(
    private readonly customerRepositoryImpl: CustomerRepository
  ) {}

  async execute( registerCustomerDto: RegisterCustomerDto ): Promise<object> {

    const customerCreated = await this.customerRepositoryImpl.registerCustomer(registerCustomerDto);

    //TODO: Validar que solo un ADMIN pueda registrar un Customer

    return { 
      Customer: customerCreated 
    };
  }

}