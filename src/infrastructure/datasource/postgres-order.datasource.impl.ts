import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { UpdateOrderDto } from "../../domain/dtos";

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

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.prisma.findUnique({
      where: {
        id: orderId,
      }
    });

    if (!order) {
      throw CustomError.notFound(`Order with id ${orderId} does not exist`);
    }

    return Order.fromJson(order);
  }

  async updateOrder(updateOrder: UpdateOrderDto): Promise<Order> {
    await this.getOrderById(updateOrder.orderId);
    const order = await this.prisma.update({
      where: {
        id: updateOrder.orderId,
      },
      data: {

        //TODO: Verificar los enum que se encuentras para datos en especifico
        estado: updateOrder.status,
        tipoEntrega: updateOrder.orderType,
        tipoPago: updateOrder.paymentType,
        esPagado: updateOrder.isPaid,
        clienteId: updateOrder.clientId,
        detalles: {
          update: updateOrder.orderDetails?.map(detalle => ({
            where: { id: detalle.orderDetailId }, 
            data: {
              platilloId: detalle.dishId,
              cantidadEntera: detalle.fullPortion, 
              cantidadMedia: detalle.halfPortion, 
            }
          }))
        }
      },
      include :{
        detalles: true
      }
    })

    return Order.fromJson(order);
  }
}