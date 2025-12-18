import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  clientId: string | undefined | number;
  userId: string | undefined;
  address?: string;
  observation?: string;
  shippingCost: number;
  totalDiscount: number;
  status: string;
  items: OrderItemRequest[];
}

export interface GetOrdersRequest {
  page: number;
  perPage: number;

  searchTerm?: string;
  status?: OrderStatusEnum;

  startDate?: string;
  endDate?: string;
}
