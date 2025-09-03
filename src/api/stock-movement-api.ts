import { api } from "@/lib/axios";
import {
  CreateStockMovementRequest,
} from "@/models/requests/stock-movement-request";
import {
  MovementReponse,
  StockMovementListResponse,
} from "@/models/responses/stock-movement-response";

class StockMovementApi {
  private baseRoute = "/stock-movements";

  async getMovements(filters?: any): Promise<StockMovementListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.productId) params.append('productId', filters.productId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.perPage) params.append('perPage', filters.perPage.toString());

    const response = await api.get(`${this.baseRoute}?${params.toString()}`);
    return response.data;
  }

  async createMovement(request: CreateStockMovementRequest): Promise<MovementReponse>{
    return await api.post(this.baseRoute, request)
  }
}

export const stockMovementApi = new StockMovementApi();