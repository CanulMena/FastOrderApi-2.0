import { CustomError } from "../errors";

export class Dish {
  constructor(
    public dishId: number,
    public name: string,
    public pricePerServing: number,
    public pricePerHalfServing: number,
    // public availableServings: number,
    public kitchenId: number,
    public sidesId?: number[],
    public imagePath?: string,
    public scheduledDays?: string[]
  ) {} 
  
  static fromJson = ( object: {[key: string] : any} ): Dish => {
    const { id, nombre, precioEntera, precioMedia, /* racionesDisponibles, */ rutaImagen, complementos, cocinaId, platillosProgramados} = object;
    if ( !id ) throw CustomError.badRequest('id is required');
    if ( !nombre ) throw CustomError.badRequest('nombre is required');
    if ( !precioEntera ) throw CustomError.badRequest('precioEntera is required');
    if ( !precioMedia ) throw CustomError.badRequest('precioMedia is required');
    if ( !cocinaId ) throw CustomError.badRequest('cocinaId is required');
    // if ( !racionDisponible ) throw CustomError.badRequest('racionDisponible is required');
    // if ( !complementos ) throw CustomError.badRequest('complementos is required');
    const sidesId = complementos?.map((complemento: { complementoId: number}) => complemento.complementoId) || [];
    // if (sidesId.length === 0) throw CustomError.badRequest('sidesId is required');
    const scheduledDays = platillosProgramados?.map((p: { diaSemana: string}) => p.diaSemana) || [];
    if (rutaImagen !== null && typeof rutaImagen !== 'string') throw CustomError.badRequest('Image Path must be a string or null');

    return new Dish(id, nombre, precioEntera, precioMedia, /* racionesDisponibles, */  cocinaId, sidesId, rutaImagen, scheduledDays);
  }
}