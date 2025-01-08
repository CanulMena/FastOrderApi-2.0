
export class UpdateKitchenDto {
  constructor(
    public readonly KitchenId: number,
    public readonly name?: string,
    public readonly address?: string,
    public readonly phone?: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, UpdateKitchenDto? ] {
    const { name, address, phone, kitchenId } = props;

    if ( !kitchenId || isNaN( Number(kitchenId) ) ) return ['ID argument must be a valid number', undefined];

    if (name !== undefined && typeof name !== 'string' ) return ['Name argument must be a string', undefined];

    if (address !== undefined && typeof address !== 'string' ) return ['Address argument must be a string', undefined];

    if (phone !== undefined ) {
      if (typeof phone !== 'string') return ['Phone argument must be a string', undefined];
      if (phone.length != 10) return ['Phone argument must be less than 10 characters', undefined];
      if (!/^\d+$/.test(phone)) return ['Phone must contain only numeric characters', undefined];
    } 

    return [undefined, new UpdateKitchenDto(kitchenId, name, address, phone)];
  }
}