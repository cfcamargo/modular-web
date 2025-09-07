import { api } from "@/lib/axios";
import { GridRequest } from "@/models/requests/grid-request";
import { PaginatedResponse } from "@/models/requests/paginated-response";
import { CreateSupplierRequest } from "@/models/requests/supplier-request";
import { SupplierResponse } from "@/models/responses/supplier-response";

const baseURL = "/suppliers";
export class SupplierApi {
  get(request: GridRequest): Promise<{ data: PaginatedResponse<SupplierResponse> }>{
    return api.get(`${baseURL}`, {
      params: request,
    });
  }

  save(
      request: CreateSupplierRequest
    ): Promise<{ data: SupplierResponse }> {
      return api.post(baseURL, request);
    }
}