
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
    //TODO: Implementar validaciones
    // if (!name) return ['Missing Name'];
    // if (!pricePerHalfServing) return ['Missing Price per Half Serving'];
    // if (!pricePerServing) return ['Missing Price per Serving'];
    // if (!kitchenId) return ['Missing Kitchen ID'];
    // if (!sidesId) return ['Missing Sides ID'];
    // if (imagePath !== null && typeof imagePath !== 'string') return ['Image Path must be a string or null'];
    // if (kitchenId !== null && (typeof kitchenId !== 'number' || kitchenId <= 0)) return ['Kitchen ID must be a positive number or null'];
    // if (sidesId !== null && !Array.isArray(sidesId)) return ['Sides ID must be an array or null'];
    // if (sidesId && sidesId.some((side: any) => typeof side !== 'number' || side <= 0)) return ['Sides ID must be an array of positive numbers or null'];
    return [undefined, new CreateDishDto( name, pricePerHalfServing, pricePerServing, kitchenId, sidesId, imagePath )];
  }

}