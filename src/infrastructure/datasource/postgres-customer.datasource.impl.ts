import { Prisma, PrismaClient } from "@prisma/client";
import { CustomerDatasource } from "../../domain/datasource/customer.datasource";
import { RegisterCustomerDto } from "../../domain/dtos/customer";
import { Customer } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import { PaginationDto } from "../../domain/dtos";

export class PostgresCustomerDatasourceImpl implements CustomerDatasource {

  // private readonly prisma = new PrismaClient();

  private readonly prismaClient = new PrismaClient().cliente;

  async registerCustomer(registerCustomerDto: RegisterCustomerDto): Promise<Customer> {

    const customerCreated = await this.prismaClient.create({
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

    const customer = await this.prismaClient.findUnique({
      where: {
        id: customerId
        }
    });

    if(!customer) throw CustomError.notFound(`Customer with id ${customerId} not found`);

    return Customer.fromJson(customer);

  }

  async getCustomersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.prismaClient.count({
      where: {
        cocinaId: kitchenId
      }
    })
  }

  async getCustomersByKitchenId(
    kitchenId: number,
    pagination: PaginationDto,
    search?: string
  ): Promise<Customer[]> {
    const { page, limit } = pagination;

    const whereClause: any = { cocinaId: kitchenId };

    if (search && search.trim() !== '') {
      // Si el término es numérico → buscar por teléfono
      if (/^\d+$/.test(search)) {
        whereClause.telefono = { startsWith: search };
      } else {
        // Si es texto → buscar por nombre
        whereClause.nombre = {
          contains: search,
          mode: 'insensitive',
        };
      }
    }

    const customers = await this.prismaClient.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      orderBy: { nombre: 'asc' },
    });

    return customers.map(Customer.fromJson);
  }

}