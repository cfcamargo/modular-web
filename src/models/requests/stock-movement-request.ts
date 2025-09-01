export enum StockMovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUST_IN = 'ADJUST_IN',
  ADJUST_OUT = 'ADJUST_OUT',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  RETURN_FROM_CLIENT = 'RETURN_FROM_CLIENT',
  // TRANSFER_* mantidos só se existirem no back
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
}

export interface CreateStockMovementRequest {
  productId: string;
  type: StockMovementType;
  quantity: string;            // ex.: "10.0000" – SEMPRE na unidade do produto
  unitCost?: string;           // ex.: "12.500000"
  unitSalePrice?: string;      // ex.: "19.900000"
  marginPct?: string;          // ex.: "30.00" (30%)
  description?: string;
  userId: string;
  supplierId?: string;         // usar em PURCHASE e RETURN_TO_SUPPLIER
  originType?: string;         // "ORDER" | "INVOICE" | "MANUAL" | "REVERSAL"
  originId?: string;
}