import { PrismaClient } from "@prisma/client";
import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { RegisterCustomerDto } from "../../domain/dtos/customer";
import { Customer } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class PostgresCustomerDatasourceImpl implements CustomerDatasource {
  
  private readonly prisma = new PrismaClient().cliente;
  
  async registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer> {
    
    const customerCreated = await this.prisma.create({
      data: {
        nombre: registerCustomerDto.name,
        telefono: registerCustomerDto.phone || null,
        direccion: registerCustomerDto.address || null,
        cocinaId: registerCustomerDto.kitchenId,
      }
    });
    
    return Customer.fromJson(customerCreated);
    
  }
  
  async getCustomerById(customerId: number): Promise<Customer> {

    const customer = await this.prisma.findUnique({
      where: {
        id: customerId 
        }
    });

    if(!customer) throw CustomError.notFound(`Customer with id ${customerId} not found`);

    return Customer.fromJson(customer);

  }

}