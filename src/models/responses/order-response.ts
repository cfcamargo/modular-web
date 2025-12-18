import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";

export interface OrderResponse {
  id: string;
  code: number;
  status: OrderStatusEnum;
  totalItems: number;
  shippingCost: number;
  totalDiscount: number;
  finalTotal: number;

  address: string | null;
  observation: string | null;

  createdAt: string;
  updatedAt: string;

  clientId: string;
  userId: string;
}
