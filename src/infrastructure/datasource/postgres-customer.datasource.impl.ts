import { PrismaClient } from "@prisma/client";
import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { RegisterCustomerDto } from "../../domain/dtos/customer";
import { Customer } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { PaginationDto } from "../../domain/dtos";

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

  async getCustomersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.prisma.count({
      where: {
        cocinaId: kitchenId
      }
    })
  }

  async getCustomersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Customer[]> {
    const { page, limit } = pagination;
    return this.prisma.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        cocinaId: kitchenId
      }
    })
    .then(
      (customers) => customers.map((customer) => Customer.fromJson(customer))
    );
  }

}