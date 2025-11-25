import { ProductionStatusEnum } from "@/utils/enums/ProductionStatusEnum";
import { ProductResponse } from "./product-response";

export interface ProductionResponse {
  id: string;
  code: number;
  quantity: number;
  deadline: Date;
  status: ProductionStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  product: ProductResponse;
}
