import { ProductRequest } from "@/models/requests/product-request";
import { MetaProps } from "@/models/responses/meta-response";
import { ProductResponse } from "@/models/responses/product-response";

export abstract class IProductApi {
  abstract get(page: number): Promise<{
    data: {
      products: {
        meta: MetaProps;
        data: ProductResponse[];
      };
    };
  }>;

  abstract getDetails(id: number): Promise<{
    data: {
      product: ProductResponse;
    };
  }>;

  abstract save(
    request: ProductRequest
  ): Promise<{ data: { product: ProductResponse } }>;

  abstract update(
    request: ProductRequest,
    id: number
  ): Promise<{ data: { product: ProductResponse } }>;

  abstract destroy(id: number): Promise<void>;
}
