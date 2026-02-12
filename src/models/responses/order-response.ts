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

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    unit: string;
    description: string;
    status: number;
    installmentPrice: string;
  };
  quantity: number;
  deliveredQuantity: number;
  price: string; // Vem como string do backend (Decimal)
  subtotal: string; // Vem como string do backend (Decimal)
}

export interface OrderDetailsResponse extends OrderResponse {
  client: {
    createdAt: string;
    document: string;
    email: string;
    id: string;
    name: string;
    phone: string | null;
    status: number;
    type: string;
    updatedAt: string;
  } | null;
  items: OrderItem[];
}
