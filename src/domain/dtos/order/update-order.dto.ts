import { Order, OrderDeliveryType, OrderPaymentType, OrderStatus } from "../../entities";
import { UpdateOrderDetailsDto } from "./update-order-details.dto";

export class UpdateOrderDto {
    constructor(
        public readonly orderId: number,
        public readonly status?: OrderStatus,
        public readonly orderType?: OrderDeliveryType,
        public readonly paymentType?: OrderPaymentType,
        public readonly isPaid?: boolean,
        public readonly clientId?: number,
        public readonly orderDetails?: UpdateOrderDetailsDto[],
    ) {}

    static create( object: {[key: string]: any} ): [string?, UpdateOrderDto?] {
        const { orderId, status, orderType, paymentType, isPaid, clientId, orderDetails} = object;

        if (!orderId || isNaN(Number(orderId)) ) return ['ID argument must be a valid number'];

        if ( status && typeof status !== 'string' && !Order.isValidOrderSatus(status)) return [`Invalid status - valid values: ${Order.OrderValidOrderStatus}`];
        if (orderType && typeof orderType !== 'string' && !Order.isValidOrderDeliveryType(orderType)) return [`Invalid order type - valid values: ${Order.OrderTypeDelivery}`];
        
        if (paymentType && typeof paymentType !== 'string' && !Order.isValidOrderPaymentType(paymentType)) return [`Invalid payment type - valid values: ${Order.OrderPaymentType}`];
        if (isPaid && typeof isPaid !== 'boolean') return ['isPaid must be a boolean'];
        if (clientId && isNaN(Number(clientId))) return ['clientId must be a number'];
        if (orderDetails && !Array.isArray(orderDetails)) return ['orderDetails must be an array'];


        return [ undefined, new UpdateOrderDto(orderId, status, orderType, paymentType, isPaid, clientId, orderDetails) ];
    }
}