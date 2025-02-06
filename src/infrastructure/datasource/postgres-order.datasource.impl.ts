import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { CreateOrderDetailsDto, UpdateOrderDetailsDto, UpdateOrderDto } from "../../domain/dtos";
import { OrderDetail } from "../../domain/entities";

export class PostgresOrderDatasourceImpl implements OrderDatasource {

  private readonly prisma = new PrismaClient().pedido;
  private readonly prismaOrderDetail = new PrismaClient().detallePedido;

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

    // Filtrar detalles a actualizar y eliminar
    const detailsToUpdate = updateOrder.orderDetails?.filter(d => !d.isDelete && d.orderDetailId);
    const detailsToDelete = updateOrder.orderDetails?.filter(d => d.isDelete && d.orderDetailId);
    const detailsToCreate = updateOrder.orderDetails?.filter(d => !d.orderDetailId);

    const order = await this.prisma.update({
      where: {
        id: updateOrder.orderId,
      },
      data: {
        estado: updateOrder.status,
        tipoEntrega: updateOrder.orderType,
        tipoPago: updateOrder.paymentType,
        esPagado: updateOrder.isPaid,
        clienteId: updateOrder.clientId,
        detalles: {
          update: detailsToUpdate?.map(detalle => ({
            where: { id: detalle.orderDetailId },
            data: {
              platilloId: detalle.dishId,
              cantidadEntera: detalle.fullPortion,
              cantidadMedia: detalle.halfPortion,
            },
          })),
          delete: detailsToDelete?.map(d => ({ id: d.orderDetailId })) ?? [],
          // create: detailsToCreate?.map(detail => ({
          //   platillo: {
          //     connect: {
          //       id: detail.dishId,
          //     }
          //   },
          //   cantidadEntera: detail.fullPortion,
          //   cantidadMedia: detail.halfPortion,
          // })) ?? [], 
        },
      },
      include: {
        detalles: true,
      }
    });


    return Order.fromJson(order);
}

  async getOrderDetailById( orderDetailId: number ): Promise<OrderDetail> {
    const orderDetail  = await this.prismaOrderDetail.findUnique({
      where: {
        id: orderDetailId
      }
    });

    if (!orderDetail) {
      throw CustomError.notFound(`Order detail with id ${orderDetailId} does not exist`);
    }

    return OrderDetail.fromJson(orderDetail);
  }

  async deleteOrder(orderId: number): Promise<Order> {
    await this.getOrderById(orderId);

    await this.prismaOrderDetail.deleteMany({
      where: {
        pedidoId: orderId,
      }
    });

    const order = await this.prisma.delete({
      where: {
        id: orderId,
      },
      include: {
        detalles: true,
      }
    });

    return Order.fromJson(order);
  }

}