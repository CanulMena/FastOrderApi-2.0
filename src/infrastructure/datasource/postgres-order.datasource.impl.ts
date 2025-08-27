import { PrismaClient } from "@prisma/client";
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../domain/dtos/order/create-order.dto';
import { OrderDatasource } from "../../domain/datasource";
import { CustomError } from "../../domain/errors";
import { CreateOrderDetailsDto, PaginationDto, UpdateOrderDto } from "../../domain/dtos";
import { Dish, OrderDetail } from "../../domain/entities";
import { OrderRange } from "../../domain/dvo";

export class PostgresOrderDatasourceImpl implements OrderDatasource {

  private readonly prisma = new PrismaClient();
  private readonly prismaPedido = this.prisma.pedido;
  private readonly prismaOrderDetail = this.prisma.detallePedido;

  async updateOrder(
    updateOrder: UpdateOrderDto, 
    orderDetailsEntity: OrderDetail[],
): Promise<Order> {
    return await this.prisma.$transaction(async (tx) => {
        // // Actualizar raciones disponibles
        // for (const orderDetailDto of updateOrder.orderDetails ?? []) {
        //     const existingDetail = orderDetailsEntity.find(orderDetailEntity => orderDetailEntity.orderDetailId === orderDetailDto.orderDetailId);
        //     if (!existingDetail) continue; // No es necesario lanzar error aquí, ya lo validamos en el UpdateOrder UseCase

        //     const requestedServings = 
        //     orderDetailDto.fullPortion !== undefined || orderDetailDto.halfPortion !== undefined
        //         ? (orderDetailDto.fullPortion ?? 0) + (orderDetailDto.halfPortion ?? 0) * 0.5
        //         : (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
        //     const previousServings = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;
        //     const servingsDifference = requestedServings - previousServings;
        //     //TODO: Cuando el control de raciones de PlatilloProgramado este activo. Disminuir limiteRaciones de PlatilloProgramado
        //     await tx.platillo.update({
        //         where: { id: existingDetail.dishId },
        //         data: { 
        //           racionesDisponibles: { 
        //             decrement: servingsDifference,
        //           }
        //         }
        //     });
        // }

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
      // for( const detail of createOrderDto.orderDetails ) { //comenzamos a iterar los orderDetails.
      //   await tx.platillo.update({
      //     where: { id: detail.dishId },
      //     data: { 
      //       racionesDisponibles: {//decrementamos las raciones disponibles
      //         decrement: detail.fullPortion + detail.halfPortion * 0.5,
      //       }
      //     }
      //   });
      // }
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
      // //? Primero es necesario restaurar las raciones de los platillos asociados a los detalles del pedido. Devolver las raciones disponibles a los platillos.
      // for (const detail of orderDetails) {
      //   // Verificar si el detalle existe en la base de datos
      //   const existingDetail = orderDetails.find(orderDetail => orderDetail.orderDetailId === detail.orderDetailId);
      //   // Si no existe, continuar con el siguiente detalle
      //   if (!existingDetail) continue;

      //   const savingsToRestore = (existingDetail.portion ?? 0) + (existingDetail.halfPortion ?? 0) * 0.5;

      //   await tx.platillo.update({
      //     where: { id: existingDetail.dishId},
      //     data: { racionesDisponibles: { increment: savingsToRestore } }
      //   })
      // }

      //? Eliminamos los detalles del pedido asociados al pedido que se va
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

    return this.prisma.$transaction(async (tx) => {
      // Actualizar raciones disponibles
      // await tx.platillo.update({
      //   where: { id: createOrderDetail.dishId}, 
      //   data: {
      //     racionesDisponibles: { decrement: createOrderDetail.fullPortion + createOrderDetail.halfPortion * 0.5 }
      //   }
      // });

      // Crear el detalle del pedido
      const orderDetail = await tx.detallePedido.create({
        data: {
          cantidadEntera: createOrderDetail.fullPortion, 
          cantidadMedia: createOrderDetail.halfPortion, 
          platilloId: createOrderDetail.dishId,
          pedidoId: createOrderDetail.orderId!,
        }
      });
      return OrderDetail.fromJson(orderDetail);
    });
  }

  async deleteOrderDetail(orderDetailId: number): Promise<OrderDetail> {
    this.getOrderDetailById(orderDetailId); // Verificar si el detalle existe
    const deleteOrderDetail = await this.prismaOrderDetail.delete({
      where: {
        id: orderDetailId
      }
    });

    return OrderDetail.fromJson(deleteOrderDetail);
  }

  //* Obtener todos los pedidos con paginación
  async getOrders(pagination: PaginationDto): Promise<Order[]> {
    const {page, limit} = pagination;
    return await this.prismaPedido.findMany({
      skip: (page - 1) * limit,
      take: limit, 
      include: {
        detalles: true
      }
    })
    .then(orders => orders.map(order => Order.fromJson(order)));
  }

  async getOrdersCount(): Promise<number> {
    return await this.prismaPedido.count();
  }

  async getOrdersByKitchenId(kitchenId: number, pagination: PaginationDto): Promise<Order[]> {
    const {page, limit} = pagination;
    return await this.prismaPedido.findMany({
      where: {
        cocinaId: kitchenId
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        detalles: true
      }
    })
    .then(orders => orders.map(order => Order.fromJson(order)));
  }

  getOrdersByKitchenIdCount(kitchenId: number): Promise<number> {
    return this.prismaPedido.count({
      where: {
        cocinaId: kitchenId
      }
    });
  }

  async getOrderedServingsByDishAndDateRange(
    dishId: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ dishId: number; dishTotalServings: number }> {
    
    const orderDetails: OrderDetail[] = await this.findOrderDetailsByDishAndDate(dishId, startDate, endDate);

    const servingsList = this.mapOrderDetailsToServings(orderDetails);

    const totalServings = this.calculateTotalServings(servingsList);

    return {
      dishId,
      dishTotalServings: totalServings,
    };
  }

    private async findOrderDetailsByDishAndDate(dishId: number, startDate: Date, endDate: Date): Promise<OrderDetail[]> {
    const orderDetailsData: {
      id: number;
      cantidadEntera: number;
      cantidadMedia: number;
      pedidoId: number;
      platilloId: number;
    }[] = await this.prismaOrderDetail.findMany({
      where: {
        platilloId: dishId,
        pedido: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });

    const orderDetailsEntity = orderDetailsData.map(orderDetail => OrderDetail.fromJson(orderDetail));

    return orderDetailsEntity;
  }

  private mapOrderDetailsToServings(orderDetails: OrderDetail[]) {
    return orderDetails.map(orderDetail => ({
      orderDetailId: orderDetail.orderDetailId,
      dishId: orderDetail.dishId,
      pedidoId: orderDetail.orderId,
      totalServings: orderDetail.portion + ((orderDetail.halfPortion ?? 0) * 0.5),
    }));
  }

  private calculateTotalServings(servingsList: { totalServings: number }[]) {
    return servingsList.reduce((acc, curr) => acc + curr.totalServings, 0);
  }

  public async getKitchenOrdersInRange(
    kitchenId: number,
    orderRange: OrderRange,
    paginationDto: PaginationDto
  ): Promise<Order[]> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    // 1. Ejecutar query a Prisma
    const orders = await this.prismaPedido.findMany({
      skip,
      take: limit,
      where: {
        cocinaId: kitchenId,
        fecha: {
          gte: orderRange.startDate,
          lte: orderRange.endDate,
        },
      },
      include: {
        detalles: true,
      },
    });

    // 2. Transformar a entidades de dominio
    return orders.map(Order.fromJson);
  }

}