
export class UpdateKitchenDto {
  constructor(
    public readonly KitchenId: number,
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, UpdateKitchenDto? ] {
    const { name, address, phone, kitchenId } = props;

    if ( !kitchenId || isNaN( Number(kitchenId) ) ) return ['ID argument must be a valid number', undefined];

    return [undefined, new UpdateKitchenDto(kitchenId, name, address, phone)];
  }
}