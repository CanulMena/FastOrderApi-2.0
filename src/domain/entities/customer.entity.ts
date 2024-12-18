import { CustomError } from "../errors";

export class Customer {
    constructor(
      public customerId: number,     // Identificador único del Customer
      public name: string,          // Nombre completo del Customer
      public kitchenId: number,    // Relación a la cocina para identificar de dónde es el Customer
      public phone?: string,      // Teléfono del Customer, opcional para llamadas
      public address?: string,   // Dirección del Customer, opcional para envíos
    ) {} //* mientras no dependas de algun argumento del constructor, puedes crear metodos estaticos
    
    static fromJson(object: {[key: string] : any}): Customer {

      const {
        id,
        nombre,
        telefono,
        direccion,
        cocinaId } = object;
  
        if(!id) throw CustomError.badRequest('Missing id');
        if(!nombre) throw CustomError.badRequest('Missing name');
        if(!cocinaId) throw CustomError.badRequest('Missing cocinaId');
        if(telefono && telefono.length !== 10) throw CustomError.badRequest('Invalid phone');
        //TODO: Investigar y validar el formato de un número de teléfono y dirección -> regular expressions
      
      return new Customer(
        id,
        nombre,
        cocinaId,
        telefono,
        direccion
      );
    }
}