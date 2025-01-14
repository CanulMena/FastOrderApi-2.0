import { RegisterCustomerDto } from '../dtos/customer';
import { Customer } from '../entities/index';


export abstract class CustomerRepository {
  abstract registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer>;
  abstract getCustomerById(CustomerId: number): Promise<Customer>;
}