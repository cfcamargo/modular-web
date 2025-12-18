import { api } from "@/lib/axios";
import {
  CreateOrderRequest,
  GetOrdersRequest,
} from "@/models/requests/order-request";
import { MetaProps } from "@/models/responses/meta-response";
import { OrderResponse } from "@/models/responses/order-response";

const baseURL = "/orders";

export interface OrderCountersProps {
  totalCount: number;
  totalDraftsCount: number;
  totalSalesValue: number;
  totalDraftsValue: number;
}

export class OrderApi {
  createOrder = async (request: CreateOrderRequest) => {
    return api.post(baseURL, request);
  };

  findAll = async (
    request: GetOrdersRequest,
  ): Promise<{
    data: {
      orders: OrderResponse[];
      counters: OrderCountersProps;
      meta: MetaProps;
    };
  }> => {
    return api.get(baseURL, { params: request });
  };
}
