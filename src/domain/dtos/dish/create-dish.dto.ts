
export class CreateDishDto {
  constructor(
    public name: string,
    public pricePerHalfServing: number,
    public pricePerServing: number,
    public availableServings: number,
    public kitchenId: number,
    public sidesId?: number[],
    public imagePath?: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, CreateDishDto? ] {
    let { name, pricePerHalfServing, pricePerServing, availableServings, kitchenId, sidesId, imagePath } = props;

    // Convertir valores numéricos que llegan como string
    pricePerHalfServing = Number(pricePerHalfServing);
    pricePerServing = Number(pricePerServing);
    availableServings = availableServings !== undefined ? Number(availableServings) : undefined;
    kitchenId = Number(kitchenId);


    // Validar y convertir sidesId de string a array si es necesario
    if (typeof sidesId === "string") { //si se envia como string.
      try {
        sidesId = JSON.parse(sidesId); //Si o si tiene que ser un array, sino se lanza un error.
      } catch (error) {
          return ['Invalid sidesId format. Must be a valid JSON array'];
      }
    }

    if (sidesId) {
      if (!Array.isArray(sidesId) ) return ['sidesId must be an array of positive numbers'];
      if (sidesId && sidesId.some((side: any) => typeof side !== 'number' || side <= 0)) return ['sidesId must be an array of positive numbers'];
    }

    if (!name) return ['Missing name'];
    if (!pricePerHalfServing) return ['Missing pricePerHalfServing'];
    if (!pricePerServing) return ['Missing pricePerServing'];
    if (!availableServings) return ['Missing availableServings'];
    if (!kitchenId) return ['Missing kitchenId'];
    if ( typeof kitchenId !== 'number' || kitchenId <= 0 ) return ['kitchenId must be a positive number'];
    if (imagePath && typeof imagePath !== 'string') return ['imagePath must be a string or null'];
    
    return [undefined, new CreateDishDto( name, pricePerHalfServing, pricePerServing, availableServings,kitchenId, sidesId, imagePath )];
  }

}