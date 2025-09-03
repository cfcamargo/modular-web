import { StockMovementTypeEnum } from "@/utils/enums/StockMovementTypeEnum";

export interface CreateStockMovementRequest {
  productId: string;

  type: StockMovementTypeEnum;
  quantity: string;          // ex.: "10.0000"

  unitCost?: string;         // ex.: "12.500000"
  unitSalePrice?: string;    // ex.: "19.900000"
  marginPct?: string;        // ex.: "30.00" (30%)

  description?: string;

  userId: string;
  supplierId?: string;

  originType?: string;
  originId?: string;
}
