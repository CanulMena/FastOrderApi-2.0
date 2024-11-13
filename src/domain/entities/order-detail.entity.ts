export class OrderDetail {
  constructor(
      public pedidoDetalleId: number,    // ID único del detalle
      public pedidoId: number,           // ID del pedido (FK a Pedido)
      public platilloId: number,         // ID del platillo (FK a Platillo)
      public cantidadEntera: number,     // Cantidad de raciones completas
      public subtotal: number,            // Subtotal calculado
      public cantidadMedia?: number,      // Cantidad de medias raciones
      public complementoId?: number,      // ID del complemento (FK a Complemento)
  ) {}
  //TODO: Create from object to create a new instance of the class
}
// calcularSubtotal(precioEntera: number, precioMedia: number): number {
//     return (this.cantidadEntera * precioEntera) + (this.cantidadMedia! * precioMedia);
// }