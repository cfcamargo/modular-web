export interface StockMovementEntryRequest {
  productId: string;
  quantity: number;
  unitCost: number;
  description?: string;
}

export interface StockMovementExitRequest {
  productId: string;
  quantity: number;
  unitSalePrice?: number;
  description?: string;
}

export interface StockMovementAdjustRequest {
  productId: string;
  targetQuantity: number;
  description?: string;
}

export interface StockMovementFilterRequest {
  productId?: string;
  type?: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}