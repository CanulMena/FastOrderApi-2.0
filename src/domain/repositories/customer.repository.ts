import { PaginationDto } from '../dtos';
import { RegisterCustomerDto } from '../dtos/customer';
import { Customer } from '../entities/index';


export abstract class CustomerRepository {
  abstract registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer>;
  abstract getCustomerById(CustomerId: number): Promise<Customer>;
  abstract getCustomersByKitchenIdCount(kitchenId: number): Promise<number>;
  abstract getCustomersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Customer[]>;
  
}