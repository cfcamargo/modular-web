import { ProductionStatusEnum } from "@/utils/enums/ProductionStatusEnum";
import { GridRequest } from "./grid-request";

export interface ProductionRequest extends GridRequest {
  status: ProductionStatusEnum | null;
}

export interface CreateProductRequest {
  productId: string;
  quantity: number;
  deadline: string | Date;
}
