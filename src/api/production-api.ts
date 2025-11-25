import { api } from "@/lib/axios";
import {
  CreateProductRequest,
  ProductionRequest,
} from "@/models/requests/production-request";
import { MetaProps } from "@/models/responses/meta-response";
import { ProductionResponse } from "@/models/responses/production-response";
import { ProductionStatusEnum } from "@/utils/enums/ProductionStatusEnum";
import { request } from "http";

const baseURL = "/production";
export class ProductionApi {
  listAll(request: ProductionRequest): Promise<{
    data: {
      orders: ProductionResponse[];
      meta: MetaProps;
    };
  }> {
    return api.get(`${baseURL}`, {
      params: request,
    });
  }

  createOrder(request: CreateProductRequest): Promise<ProductionResponse> {
    return api.post(`${baseURL}`, request);
  }

  updateStatus(request: { orderId: string; status: ProductionStatusEnum }) {
    return api.patch(`${baseURL}/${request.orderId}/status`, {
      status: request.status,
    });
  }
}
