import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { UpdateOrderDto } from "../../domain/dtos";
import { OrderDetail } from "../../domain/entities";

export class PostgresOrderDatasourceImpl implements OrderDatasource {

  private readonly prisma = new PrismaClient();
  private readonly prismaPedido = this.prisma.pedido;
  private readonly prismaOrderDetail = this.prisma.detallePedido;

  async updateOrder(
    updateOrder: UpdateOrderDto, 
    orderDetailsEntity: OrderDetail[]
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
                data: { racionesDisponibles: { decrement: servingsDifference } }
            });
        }

        // Actualizar detalles del pedido
        const detailsToUpdate = updateOrder.orderDetails?.filter(detail => !detail.isDelete && detail.orderDetailId);

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
    const order = await this.prismaPedido.create({
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

  async getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {
    const orderDetails = await this.prismaOrderDetail.findMany({
      where: {
        pedidoId: orderId
      }
    });

    return orderDetails.map(OrderDetail.fromJson);
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
}