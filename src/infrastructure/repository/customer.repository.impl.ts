import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { RegisterCustomerDto } from "../../domain/dtos/customer";
import { Customer } from "../../domain/entities";
import { CustomerRepository } from "../../domain/repositories/customer.repository";


export class CustomerRepositoryImpl implements CustomerRepository {

  constructor(
    private readonly customerDatasource: CustomerDatasource
  ){}
  
  registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer> {
    return this.customerDatasource.registerCustomer(registerCustomerDto);
  }

}