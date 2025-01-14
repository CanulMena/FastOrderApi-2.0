import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";

export class PostgresOrderDatasourceImpl implements OrderDatasource {

  private readonly prisma = new PrismaClient().pedido;

  async createOder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.prisma.create({
      data: {
        fecha: createOrderDto.date,
        estado: createOrderDto.status,
        tipoEntrega: createOrderDto.orderType,
        tipoPago: createOrderDto.paymentType,
        esPagado: createOrderDto.isPaid,
        clienteId: createOrderDto.clientId,
        cocinaId: createOrderDto.kitchenId,
        detalles: {
          create: createOrderDto.orderDetails.map(detail => ({
            cantidadEntera: detail.fullPortion, // Mapeo de cantidad entera
            cantidadMedia: detail.halfPortion, // Mapeo de cantidad media
            platilloId: detail.dishId, // ID del platillo relacionado
          })),
        },
      },
      include: {
        detalles: true, // Incluir detalles en la respuesta
      },
    });

    return Order.fromJson(order);
  }

}