import { api } from "@/lib/axios";
import {
  CreateOrderRequest,
  GetOrdersRequest,
} from "@/models/requests/order-request";
import { MetaProps } from "@/models/responses/meta-response";
import {
  OrderDetailsResponse,
  OrderResponse,
} from "@/models/responses/order-response";
import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";

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

  findOne = async (
    id: string,
  ): Promise<{
    data: OrderDetailsResponse;
  }> => {
    return api.get(`${baseURL}/${id}`);
  };

  cancelOrderApi = async (id: string) => {
    return api.post(`${baseURL}/${id}`);
  };

  changeStatus = async (request: { id: string; status: OrderStatusEnum }) => {
    return api.patch(`${baseURL}/status`, request);
  };
}
