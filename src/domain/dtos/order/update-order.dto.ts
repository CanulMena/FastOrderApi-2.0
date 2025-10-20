import { Order, OrderDeliveryType, OrderPaymentType, OrderStatus } from "../../entities";
import { UpdateOrderDetailsDto } from "./update-order-details.dto";

export class UpdateOrderDto {
    constructor(
        public readonly orderId: number,
        public readonly date?: Date,
        public readonly status?: OrderStatus,
        public readonly orderType?: OrderDeliveryType,
        public readonly paymentType?: OrderPaymentType,
        public readonly isPaid?: boolean,
        public readonly clientId?: number,
        public readonly orderDetails?: UpdateOrderDetailsDto[],
        public readonly notes?: string,
    ) {}

    static create( object: {[key: string]: any} ): [string?, UpdateOrderDto?] {
    const { orderId, date, status, orderType, paymentType, isPaid, clientId, orderDetails, notes } = object;

        if (!orderId || isNaN(Number(orderId)) ) return ['ID argument must be a valid number'];

        const newDate = new Date(date);
        if (date && isNaN(newDate.getTime())) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];
        //si el status existe y no es un string y no es un valor valido de OrderStatus
        //¿Por que no entrá a esta condición??
        if (status && (typeof status !== 'string' || !Order.isValidOrderSatus(status))) return [`Invalid status - valid values: ${Order.OrderValidOrderStatus}`];
        if (orderType && (typeof orderType !== 'string' || !Order.isValidOrderDeliveryType(orderType))) return [`Invalid order type - valid values: ${Order.OrderTypeDelivery}`];
        
        if (paymentType && (typeof paymentType !== 'string' || !Order.isValidOrderPaymentType(paymentType))) return [`Invalid payment type - valid values: ${Order.OrderPaymentType}`];
        if (isPaid && typeof isPaid !== 'boolean') return ['isPaid must be a boolean'];
        if (clientId && isNaN(Number(clientId))) return ['clientId must be a number'];

        const validatedDetails: UpdateOrderDetailsDto[] = [];
        if (orderDetails && !Array.isArray(orderDetails)) return ['orderDetails must be an array'];
        if (orderDetails) {
            for (const detail of orderDetails) {
                const [error, validDetail] = UpdateOrderDetailsDto.create(detail);
                if (error) return [error];
                if (validDetail) validatedDetails.push(validDetail);
            }
        }
        if (notes && typeof notes !== 'string') return ['notes must be a string'];

        return [ undefined, new UpdateOrderDto(orderId, date, status, orderType, paymentType, isPaid, clientId, orderDetails, notes) ];
    }
}