export interface OrderResponseDto {
  orderId: number;
  date: Date;
  status: string;
  deliveryType: string;
  paymentType: string;
  isPaid: boolean;
  clientName?: string;
  kitchenId: number;
  clientId?: number
  total: number;
  orderDetails: {
    orderDetailId: number;
    portion: number
    dishId: number;
    orderId: number;
    halfPortion: number | undefined;
    subtotal: number;
    imagePath?: string;
  }[];
}
