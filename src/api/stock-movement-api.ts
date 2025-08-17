import { api } from "@/lib/axios";
import {
  StockMovementEntryRequest,
  StockMovementExitRequest,
  StockMovementAdjustRequest,
  StockMovementFilterRequest,
} from "@/models/requests/stock-movement-request";
import {
  StockMovementResponse,
  StockMovementListResponse,
} from "@/models/responses/stock-movement-response";

class StockMovementApi {
  private baseRoute = "/stock-movements";

  async getMovements(filters?: StockMovementFilterRequest): Promise<StockMovementListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.productId) params.append('productId', filters.productId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

    const response = await api.get(`${this.baseRoute}?${params.toString()}`);
    return response.data;
  }

  async createEntry(data: StockMovementEntryRequest): Promise<StockMovementResponse> {
    const response = await api.post(`${this.baseRoute}/entry`, {
      productId: data.productId,
      quantity: data.quantity,
      unitCost: data.unitCost,
      description: data.description || undefined,
    });
    return response.data;
  }

  async createExit(data: StockMovementExitRequest): Promise<StockMovementResponse> {
    const response = await api.post(`${this.baseRoute}/exit`, {
      productId: data.productId,
      quantity: data.quantity,
      unitSalePrice: data.unitSalePrice || undefined,
      description: data.description || undefined,
    });
    return response.data;
  }

  async createAdjust(data: StockMovementAdjustRequest): Promise<StockMovementResponse> {
    const response = await api.post(`${this.baseRoute}/adjust`, {
      productId: data.productId,
      targetQuantity: data.targetQuantity,
      description: data.description || undefined,
    });
    return response.data;
  }
}

export const stockMovementApi = new StockMovementApi();