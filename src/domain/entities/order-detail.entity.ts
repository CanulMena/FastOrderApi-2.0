import { CustomError } from "../errors";

export class OrderDetail {
  constructor(
      public orderDetailId: number,    // ID único del detalle
      public portion: number,     // Cantidad de raciones completas
      public dishId: number,         // ID del platillo (FK a Platillo)
      public orderId: number,           // ID del pedido (FK a Pedido)
      public halfPortion?: number,      // Cantidad de medias raciones
  ) {}
  
  static fromJson(object: { [key: string]: any }): OrderDetail {
    const { id, cantidadEntera, cantidadMedia, pedidoId, platilloId } = object;

    if (!id) throw CustomError.badRequest('Missing id');
    if (!platilloId || typeof platilloId !== 'number' || platilloId <= 0) throw CustomError.badRequest('platilloId must be a valid number greater than 0');
    if (typeof cantidadEntera !== 'number' || cantidadEntera < 0) throw CustomError.badRequest('portion must be a non-negative number');
    if (typeof cantidadMedia !== 'number' || cantidadMedia < 0) throw CustomError.badRequest('halfPortion must be a non-negative number');
    if (!pedidoId) throw CustomError.badRequest('Missing pedidoId');
    if (cantidadEntera === 0 && cantidadMedia === 0) throw CustomError.badRequest('At least one of portion or halfPortion must be greater than 0');


    return new OrderDetail( id, cantidadEntera, platilloId, pedidoId, cantidadMedia);
  }
}
