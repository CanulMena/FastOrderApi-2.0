
export class UpdateDishDto {
  constructor(
    public readonly dishId: number,
    public readonly name?: string,
    public readonly pricePerServing?: number,
    public readonly pricePerHalfServing?: number,  
    // public readonly availableServings?: number,  
    public readonly sidesId?: number[],
    public readonly imagePath?: string,
  ){}

  static create( object: {[key: string]: any} ): [string?, UpdateDishDto?] {
    const { dishId, name, pricePerServing, pricePerHalfServing,/*  availableServings, */ sidesId, imagePath } = object;

    if ( !dishId || isNaN( Number(dishId) ) ) return ['ID argument must be a valid number'];
    if ( name && typeof name !== 'string' ) return ['name must be a string'];
    if ( pricePerServing && typeof pricePerServing !== 'number' ) return ['pricePerServing must be a number'];
    if ( pricePerHalfServing && typeof pricePerHalfServing !== 'number' ) return ['pricePerHalfServing must be a number'];
    // if ( availableServings && typeof availableServings !== 'number') return ['availableServings must be a number'];
    if ( sidesId && !Array.isArray(sidesId) ) return ['sidesId must be an array'];
    if ( sidesId && sidesId.some( (sideId: number) => typeof sideId !== 'number' ) ) return ['sidesId must be an array of numbers'];
    if ( imagePath && typeof imagePath !== 'string' ) return ['imagePath must be a string'];

    return [ undefined, new UpdateDishDto(dishId, name, pricePerServing, pricePerHalfServing, /* availableServings, */ sidesId, imagePath) ];
  }
}