import { StockMovementType } from "../common/stockMovementType";

export interface MovementReponse {
    id: string;
    description: string | null;
    createdAt: Date;
    type: StockMovementType;
    quantity: number;
    unitCost: number | null;
    unitSalePrice: number | null;
    totalCost: number | null;
    totalRevenue: number | null;
    marginPct: number | null;
    originType: string | null;
    originId: string | null;
    reversedById: string | null;
    reversedAt: Date | null;
    productId: string;
    userId: string;
    supplierId: string | null;
}

export interface StockMovementListResponse {
  data: MovementReponse[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}


