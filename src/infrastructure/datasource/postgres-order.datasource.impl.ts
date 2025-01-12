import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';

export class PostgresOrderDatasourceImpl {

  private readonly prisma = new PrismaClient().pedido;

  async createOrder( createOrderDto: CreateOrderDto ){

    const order = await this.prisma.create({
      data: {
        fecha: createOrderDto.date,
        estado: createOrderDto.status,
        tipoEntrega: createOrderDto.orderType,
        tipoPago: createOrderDto.paymentType,
        esPagado: createOrderDto.isPaid,
        clienteId: createOrderDto.clientId,
        cocinaId: createOrderDto.kitchenId
      }
    });

    return Order.fromJson(order);
  }

}