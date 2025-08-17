export interface StockMovementResponse {
  id: string;
  productId: string;
  productName: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantity: number;
  unitCost?: number;
  unitSalePrice?: number;
  description?: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementListResponse {
  data: StockMovementResponse[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}