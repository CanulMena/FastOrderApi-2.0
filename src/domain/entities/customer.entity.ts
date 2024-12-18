export class Customer {
    constructor(
      public customerId: number,       // Identificador único del Customer
      public name: string,          // Nombre completo del Customer
      public kitchenId: number,    // Relación a la cocina para identificar de dónde es el Customer
      public phone?: string,      // Teléfono del Customer, opcional para llamadas
      public address?: string,   // Dirección del Customer, opcional para envíos
    ) {}
    //TODO: Create from object to create a new instance of the class
}