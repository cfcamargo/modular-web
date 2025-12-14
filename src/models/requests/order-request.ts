export interface OrderItemRequest {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  clientId: string | number;
  userId: string | number;
  address?: string;
  observation?: string;
  shippingCost: number;
  totalDiscount: number;
  status: string;
  items: OrderItemRequest[];
}
