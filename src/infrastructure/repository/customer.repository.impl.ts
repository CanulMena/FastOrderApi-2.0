import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { PaginationDto } from "../../domain/dtos";
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

  getCustomerById(CustomerId: number): Promise<Customer> {
    return this.customerDatasource.getCustomerById(CustomerId);
  }

  getCustomersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.customerDatasource.getCustomersByKitchenIdCount(kitchenId);
  }

  getCustomersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Customer[]> {
    return this.customerDatasource.getCustomersByKitchenId(kitchenId, pagination);
  }

}