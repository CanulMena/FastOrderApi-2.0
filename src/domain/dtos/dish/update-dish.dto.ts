
export class UpdateDishDto {
  constructor(
    public readonly dishId: number,
    public readonly name?: string,
    public readonly pricePerServing?: number,
    public readonly pricePerHalfServing?: number,    
    public readonly sidesId?: number[],
    public readonly imagePath?: string,
  ){}

  static create( object: {[key: string]: any} ): [string, UpdateDishDto?] {
    const { dishId, name, pricePerServing, pricePerHalfServing, sidesId, imagePath } = object;
    if ( !dishId || isNaN( Number(dishId) ) ) return ['ID argument must be a valid number', undefined];
    if ( name && typeof name !== 'string' ) return ['name must be a string', undefined];
    if ( pricePerServing && typeof pricePerServing !== 'number' ) return ['pricePerServing must be a number', undefined];
    if ( pricePerHalfServing && typeof pricePerHalfServing !== 'number' ) return ['pricePerHalfServing must be a number', undefined];
    if ( sidesId && !Array.isArray(sidesId) ) return ['sidesId must be an array', undefined];
    if ( sidesId && sidesId.some( (sideId: number) => typeof sideId !== 'number' ) ) return ['sidesId must be an array of numbers', undefined];
    if ( imagePath && typeof imagePath !== 'string' ) return ['imagePath must be a string', undefined];

    return [ '', new UpdateDishDto(dishId, name, pricePerServing, pricePerHalfServing, sidesId, imagePath) ];
  }
}