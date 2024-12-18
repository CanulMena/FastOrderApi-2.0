import { PrismaClient } from "@prisma/client";
import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { RegisterCustomerDto } from "../../domain/dtos/customer";
import { Customer } from "../../domain/entities";

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

}