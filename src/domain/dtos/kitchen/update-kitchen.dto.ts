
export class UpdateKitchenDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, UpdateKitchenDto? ] {
    const { name, address, phone, id } = props;

    if ( !id || isNaN( Number(id) ) ) return ['ID argument must be a valid number', undefined];

    return [undefined, new UpdateKitchenDto(id, name, address, phone)];
  }
}