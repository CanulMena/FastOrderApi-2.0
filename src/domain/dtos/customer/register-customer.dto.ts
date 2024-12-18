
export class RegisterCustomerDto {
  constructor(
    public name: string,   
    public kitchenId: number,
    public phone?: string,    
    public address?: string,
  ) {}

  static create( props: {[key: string]: any} ): [ string?, RegisterCustomerDto? ] {
    const { name, kitchenId, phone, address } = props;
    if (!name) return ['Missing Name'];
    if (!kitchenId) return ['Missing Kitchen ID'];
    if (phone !== null && typeof phone !== 'string') return ['Phone must be a string or null'];
    if (phone && phone.length !== 10) return ['Invalid Phone'];
    if (address !== null && typeof address !== 'string') return ['Address must be a string or null'];
    if (kitchenId !== null && (typeof kitchenId !== 'number' || kitchenId <= 0)) return ['Kitchen ID must be a positive number or null'];
    //TODO: Investigar y validar el formato de un número de teléfono y dirección -> regular expressions

    return [undefined, new RegisterCustomerDto( name, kitchenId, phone, address )];
  }

}