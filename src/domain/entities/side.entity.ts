export class Side {
  constructor(
    public sideId: number, //Identificador unico del complemento
    public name: string, //Nombre del complemento
    public imageUrl: string, //Dirección de la url de la imagen
    public kitchenId: number, //Relacion a la cocina para identificar de donde es el complement
  ){}
  //TODO: Create from object to create a new instance of the class
}