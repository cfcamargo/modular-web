import { api } from "@/lib/axios";
import { CreateOrderRequest } from "@/models/requests/order-request";

const baseURL = "/orders";
export class OrderApi {
  createOrder = async (request: CreateOrderRequest) => {
    return api.post(baseURL, request);
  };
}
