import { CustomError } from "../errors";

export class Side {
  constructor(
    public sideId: number, //Identificador unico del complemento
    public name: string, //Nombre del complemento
    public kitchenId: number, //Relacion a la cocina para identificar de donde es el complement
    public imageUrl?: string, //Dirección de la url de la imagen
    public description?: string, //Descripción del complemento
  ){}

  static fromJson(object: {[key: string] : any  }) : Side {

    const { 
      id,
      nombre,
      cocinaId,
      rutaImagen,
      descripcion,
    } = object;

    if ( !id ) throw CustomError.badRequest('Missing id');
    if ( !nombre ) throw CustomError.badRequest('Missing name');
    if ( !cocinaId ) throw CustomError.badRequest('Missing cocinaId');

    return new Side(
      id,
      nombre,
      cocinaId,
      rutaImagen,
      descripcion,
    )
  }
}