import { ProductResponse } from "@/models/responses/product-response";
import { api } from "@/lib/axios";
import { ProductRequest } from "@/models/requests/product-request";
import { GridRequest } from "@/models/requests/grid-request";
import { MetaProps } from "@/models/responses/meta-response";

const baseURL = "/products";
export class ProductApi {
  get(request: GridRequest): Promise<{
    data: {
      products: ProductResponse[];
      meta: MetaProps;
    };
  }> {
    return api.get(`${baseURL}`, {
      params: request,
    });
  }

  save(request: ProductRequest): Promise<{ data: ProductResponse }> {
    return api.post(baseURL, request);
  }

  getDetails(id: string): Promise<{ data: ProductResponse }> {
    return api.get(`${baseURL}/${id}`);
  }

  destroy(id: string): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }

  update(
    request: ProductRequest,
    id: string
  ): Promise<{ data: { product: ProductResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }
}
