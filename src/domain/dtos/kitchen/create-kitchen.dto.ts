
export class CreateKitchenDto {
  constructor(
    public readonly name: string, //?Readonly significa que no se puede modificar después de la creación
    public readonly address: string,
    public readonly phone: string,
  ){}

  static create( props: {[key: string]: any} ): [ string?, CreateKitchenDto? ] {
    const { name, address, phone } = props;

    if ( !name ) return ['Name is required', undefined];
    if ( !address ) return ['Address is required', undefined]; //todo: Validar que la dirección sea válida en el futuro
    if ( !phone ) return ['Phone is required', undefined];

    return [undefined, new CreateKitchenDto(name, address, phone)];
  }

}