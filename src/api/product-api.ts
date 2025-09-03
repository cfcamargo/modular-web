import { ProductResponse } from "@/models/responses/product-response";
import { api } from "@/lib/axios";
import { ProductRequest } from "@/models/requests/product-request";
import { PaginatedResponse } from "@/models/requests/paginated-response";
import { GridRequest } from "@/models/requests/grid-request";

const baseURL = "/products";
export class ProductApi {
  get(
    request: GridRequest
  ): Promise<{ data: PaginatedResponse<ProductResponse> }> {
    return api.get(`${baseURL}`, {
      params: request,
    });
  }

  save(
    request: ProductRequest
  ): Promise<{ data: ProductResponse }> {
    return api.post(baseURL, request);
  }

  getDetails(id: string): Promise<{ data: { product: ProductResponse } }> {
    return api.get(`${baseURL}/${id}`);
  }

  destroy(id: number): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }

  update(
    request: ProductRequest,
    id: string
  ): Promise<{ data: { product: ProductResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }

  deactivate(id: number): Promise<{ data: { product: ProductResponse } }> {
    return api.patch(`${baseURL}/${id}/deactivate`);
  }
}
