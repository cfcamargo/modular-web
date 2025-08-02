import { MetaProps } from "@/models/responses/meta-response";
import { ProductResponse } from "@/models/responses/product-response";
import { api } from "@/lib/axios";
import { ProductRequest } from "@/models/requests/product-request";

const baseURL = "/products";
export class ProductApi {
  get(page: number): Promise<{
    data: { products: { meta: MetaProps; data: ProductResponse[] } };
  }> {
    return api.get(`${baseURL}?page=${page}`);
  }

  save(
    request: ProductRequest
  ): Promise<{ data: { product: ProductResponse } }> {
    return api.post(baseURL, request);
  }

  getDetails(id: number): Promise<{ data: { product: ProductResponse } }> {
    return api.get(`${baseURL}/${id}`);
  }

  destroy(id: number): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }

  update(
    request: ProductRequest,
    id: number
  ): Promise<{ data: { product: ProductResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }
}
