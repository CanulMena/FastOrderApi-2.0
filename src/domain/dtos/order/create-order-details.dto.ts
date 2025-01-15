export class CreateOrderDetailsDto {
  constructor(
    public fullPortion: number,
    public halfPortion: number,
    public dishId: number
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateOrderDetailsDto?] {
    const { fullPortion = 0, halfPortion = 0, dishId } = props;

    //TODO: VALIDA QUE FULL-PORTION Y HALF-PORTION SEAN NUMEROS NO NEGATIVOS Y NO SEAN UNDEFINED

    if (!dishId || typeof dishId !== 'number' || dishId <= 0) return ['dishId must be a valid number greater than 0'];
    if (typeof fullPortion !== 'number' || fullPortion < 0) return ['portion must be a non-negative number'];
    if (typeof halfPortion !== 'number' || halfPortion < 0) return ['halfPortion must be a non-negative number'];
    if (fullPortion === 0 && halfPortion === 0) return ['At least one of portion or halfPortion must be greater than 0'];

    return [undefined, new CreateOrderDetailsDto(fullPortion, halfPortion, dishId)];
  }
}
