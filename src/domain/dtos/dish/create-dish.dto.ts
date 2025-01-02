
export class CreateDishDto {
  constructor(
    public name: string,
    public pricePerHalfServing: number,
    public pricePerServing: number,
    public kitchenId: number,
    public sidesId: number[],
    public imagePath?: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, CreateDishDto? ] {
    const { name, pricePerHalfServing, pricePerServing, kitchenId, sidesId, imagePath } = props;
    if (!name) return ['Missing name'];
    if (!pricePerHalfServing) return ['Missing pricePerHalfServing'];
    if (!pricePerServing) return ['Missing pricePerServing'];
    if (!kitchenId) return ['Missing kitchenId'];
    if (sidesId.length === 0) return ['sidesId is required'];
    if ( typeof kitchenId !== 'number' || kitchenId <= 0 ) return ['Kitchen ID must be a positive number', undefined];
    if (sidesId.length === 0) return ['Sides ID is required'];
    // if (sidesId && sidesId.some((side: any) => typeof side !== 'number' || side <= 0)) return ['Sides ID must be an array of positive numbers or null'];
    if (imagePath !== null && typeof imagePath !== 'string') return ['Image Path must be a string or null'];
    return [undefined, new CreateDishDto( name, pricePerHalfServing, pricePerServing, kitchenId, sidesId, imagePath )];
  }

}