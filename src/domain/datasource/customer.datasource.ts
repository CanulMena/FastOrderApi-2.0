import { RegisterCustomerDto } from '../dtos/customer';
import { Customer } from '../entities/index';


export abstract class CustomerDatasource {
  abstract registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer>;
}