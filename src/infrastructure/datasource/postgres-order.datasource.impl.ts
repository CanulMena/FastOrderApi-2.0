import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { CreateOrderDetailsDto, UpdateOrderDto } from "../../domain/dtos";
import { Dish, OrderDetail } from "../../domain/entities";

export class PostgresOrderDatasourceImpl implements OrderDatasource {

  private readonly prisma = new PrismaClient();
  private readonly prismaPedido = this.prisma.pedido;
  private readonly prismaOrderDetail = this.prisma.detallePedido;

  async updateOrder(
    updateOrder: UpdateOrderDto, 
    orderDetailsEntity: OrderDetail[],
): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
        // Actualizar raciones disponibles
        for (const detailDto of updateOrder.orderDetails ?? []) {
            const existingDetail = orderDetailsEntity.find(orderDetailEntity => orderDetailEntity.orderDetailId === detailDto.orderDetailId);
            if (!existingDetail) continue; // No es necesario lanzar error aquí, ya lo validamos en el UseCase

            const requestedServings = 
            detailDto.fullPortion !== undefined || detailDto.halfPortion !== undefined
                ? (detailDto.fullPortion ?? 0) + (detailDto.halfPortion ?? 0) * 0.5
                : (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
            const previousServings = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
            const servingsDifference = requestedServings - previousServings;

            await tx.platillo.update({
                where: { id: existingDetail.dishId },
                data: { 
                  racionesDisponibles: { 
                    decrement: servingsDifference,
                  }
                }
            });
        }

        // Actualizar detalles del pedido
        const detailsToUpdate = updateOrder.orderDetails?.filter(detail => detail.orderDetailId);

        const updatedOrder = await tx.pedido.update({
            where: { id: updateOrder.orderId },
            data: {
                estado: updateOrder.status,
                tipoEntrega: updateOrder.orderType,
                tipoPago: updateOrder.paymentType,
                esPagado: updateOrder.isPaid,
                clienteId: updateOrder.clientId,
                detalles: {
                    update: detailsToUpdate!.map(detalle => ({
                        where: { id: detalle.orderDetailId },
                        data: {
                            platilloId: detalle.dishId,
                            cantidadEntera: detalle.fullPortion,
                            cantidadMedia: detalle.halfPortion,
                        },
                    })),
                },
            },
            include: {
                detalles: true
            }
        });
        return Order.fromJson(updatedOrder);
    });
}


  async createOder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // Actualizar raciones disponibles
      for( const detail of createOrderDto.orderDetails ) { //comenzamos a iterar los orderDetails.
        await tx.platillo.update({
          where: { id: detail.dishId },
          data: { 
            racionesDisponibles: {//decrementamos las raciones disponibles
              decrement: detail.fullPortion + detail.halfPortion * 0.5,
            }
          }
        });
      }
      //Por ultimo creamos el pedido.
      const order = await tx.pedido.create({
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
    });

  }

  async getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {
    const orderDetails = await this.prismaOrderDetail.findMany({
      where: {
        pedidoId: orderId
      }
    });

    return orderDetails.map(OrderDetail.fromJson);
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.prismaPedido.findUnique({
      where: {
        id: orderId,
      }
    });

    if (!order) {
      throw CustomError.notFound(`Order with id ${orderId} does not exist`);
    }

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

  async deleteOrder(orderId: number, orderDetails: OrderDetail[]): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
      for (const detail of orderDetails) {
        const existingDetail = orderDetails.find(orderDetail => orderDetail.orderDetailId === detail.orderDetailId);
        if (!existingDetail) continue;

        const savingsToRestore = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;

        await tx.platillo.update({
          where: { id: existingDetail.dishId},
          data: { racionesDisponibles: { increment: savingsToRestore } }
        })
      }

      await tx.detallePedido.deleteMany({
        where: { pedidoId: orderId }
      });

      const deleteOrder = await tx. pedido.delete({
        where: { id: orderId }, 
        include: { detalles: true },
      });

      return Order.fromJson(deleteOrder);
    })
  }

  // create a Order Detail
  async createOrderDetail(createOrderDetail: CreateOrderDetailsDto): Promise<OrderDetail> {
    await this.getOrderById(createOrderDetail.orderId!);
    const orderDetail = await this.prismaOrderDetail.create({
      data: {
        cantidadEntera: createOrderDetail.fullPortion, 
        cantidadMedia: createOrderDetail.halfPortion,
        platilloId: createOrderDetail.dishId,
        pedidoId: createOrderDetail.orderId!,
      }
    });

    return OrderDetail.fromJson(orderDetail);
  }

  async deleteOrderDetail(orderDetailId: number): Promise<OrderDetail> {
    const deleteOrderDetail = await this.prismaOrderDetail.delete({
      where: {
        id: orderDetailId
      }
    });

    return OrderDetail.fromJson(deleteOrderDetail);
  }

}