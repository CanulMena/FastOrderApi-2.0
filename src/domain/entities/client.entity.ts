export class Client {
    constructor(
      public clientId: number,       // Identificador único del cliente
      public name: string,          // Nombre completo del cliente
      public kitchenId: number,    // Relación a la cocina para identificar de dónde es el cliente
      public phone?: string,      // Teléfono del cliente, opcional para llamadas
      public address?: string,   // Dirección del cliente, opcional para envíos
    ) {}
    //TODO: Create from object to create a new instance of the class
}