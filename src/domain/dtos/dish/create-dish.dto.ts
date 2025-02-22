
export class CreateDishDto {
  constructor(
    public name: string,
    public pricePerHalfServing: number,
    public pricePerServing: number,
    public availableServings: number,
    public kitchenId: number,
    public sidesId: number[],
    public imagePath?: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, CreateDishDto? ] {
    let { name, pricePerHalfServing, pricePerServing, availableServings, kitchenId, sidesId, imagePath } = props;

    // Convertir valores numéricos que llegan como string
    pricePerHalfServing = Number(pricePerHalfServing);
    pricePerServing = Number(pricePerServing);
    availableServings = availableServings !== undefined ? Number(availableServings) : undefined;
    kitchenId = Number(kitchenId);

    // Convertir sidesId de string a array si es necesario
    sidesId = typeof sidesId === "string" ? JSON.parse(sidesId) : sidesId;


    if (!name) return ['Missing name'];
    if (!pricePerHalfServing) return ['Missing pricePerHalfServing'];
    if (!pricePerServing) return ['Missing pricePerServing'];
    // if (!availableServings) return ['Missing availableServings'];
    if (!kitchenId) return ['Missing kitchenId'];
    if (!sidesId) return ['Missing sidesId'];
    if ( !Array.isArray(sidesId) ) return ['sidesId must be an array of positive numbers', undefined];
    if ( typeof kitchenId !== 'number' || kitchenId <= 0 ) return ['kitchenId must be a positive number', undefined];
    if (sidesId && sidesId.some((side: any) => typeof side !== 'number' || side <= 0)) return ['sidesId must be an array of positive numbers'];
    if (imagePath !== null && typeof imagePath !== 'string') return ['imagePath must be a string or null'];
    
    return [undefined, new CreateDishDto( name, pricePerHalfServing, pricePerServing, availableServings,kitchenId, sidesId, imagePath )];
  }

}