

export class UpdateOrderDetailsDto {
    constructor(
        public readonly orderDetailId: number,
        public readonly dishId?: number,
        public readonly fullPortion?: number,
        public readonly halfPortion?: number,
        public readonly isDelete?: boolean
    ) {}

    static create( object: {[key: string]: any} ): [string?, UpdateOrderDetailsDto? ] {
        const {orderDetailId, dishId, fullPortion, halfPortion, isDelete } = object;

        if (orderDetailId && isNaN(Number(orderDetailId))) return ['orderDetailId must be a number'];
        if (dishId && isNaN(Number(dishId))) return ['dishId must be a number'];
        if (fullPortion && isNaN(Number(fullPortion))) return ['fullPortion must be a number'];
        if (halfPortion && isNaN(Number(halfPortion))) return ['halfPortion must be a number'];
        if (isDelete !== undefined  && typeof isDelete !== 'boolean') return ['isDeleted must be a boolean']; //? Se agrega validación para isDelete (ualquier valor diferente de false, 0, null o undefined se considerará como true)

        return [ undefined, new UpdateOrderDetailsDto(orderDetailId, dishId, fullPortion, halfPortion, isDelete) ];
    }
}